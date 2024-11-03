

"use client";
import { useEffect, useState } from "react";
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient";
import {
    PostWithAuthorAndSubtopicDataTypes,
    Post_SubtopicsDataTypes,
    SubtopicsDataTypes,
    TopicsDataTypes,
} from "@/utils/types";
import PostCard from "@/components/PostCard";

const SubtopicPage = ({ params }: { params: { slug: string } }) => {
    // const {topics} = useFetchContext()
    const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
    const [subtopic, setSubtopic] = useState<SubtopicsDataTypes | null>(null);
    const [postSubtopic, setPostSubtopic] = useState<Post_SubtopicsDataTypes[] | null>([]);
    const {
        posts,
        loading,
        setLoading,
        error,
        setError,
        filteredPosts,
        setFilteredPosts,
    } = useFetchContext();
    const { currentUser } = useGeneralContext();

    const slug = params.slug;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Reset states
                setSubtopic(null);
                setPostSubtopic([]);
                setFilteredPosts([]);

                // Fetch subtopic data by slug
                const { data: subtopicData, error: subtopicError } = await supabase
                    .from("subtopics")
                    .select("*")
                    .eq("slug", slug)
                    .maybeSingle();

                if (subtopicError) throw subtopicError;
                if (!subtopicData) throw new Error(`No subtopic found for slug: ${slug}`);
                setSubtopic(subtopicData);
                

                // Fetch post_subtopics for the specific subtopic
                const { data: postSubtopicData, error: postSubtopicError } = await supabase
                    .from("post_subtopics")
                    .select("post_id")
                    .eq("subtopic_id", subtopicData.id);

                if (postSubtopicError) throw postSubtopicError;
                if (!postSubtopicData || postSubtopicData.length === 0) {
                    console.log(`No posts found for subtopic ID: ${subtopicData.id}`);
                    return; 
                }
                //ilgili subtopic'e ait postlarin id'sini getiriyoruz
                setPostSubtopic(postSubtopicData as Post_SubtopicsDataTypes[]);
                
                // Get post IDs and fetch posts with author and subtopic-topic details
                const postIds = postSubtopicData.map((ps) => ps.post_id);
                const { data: filteredPostsData, error: filteredPostsError } = await supabase
                    .from('posts')
                    .select(`
                        *,
                        author:users (
                            id,
                            username,
                            image
                        ),
                        post_subtopics (
                            subtopic_id,
                            subtopic:subtopics (
                                id,
                                name,
                                topic:topics (
                                    id,
                                    name
                                )
                            )
                        )
                    `)
                    .in('id', postIds);


                if (filteredPostsError) throw filteredPostsError;
                setFilteredPosts(filteredPostsData as PostWithAuthorAndSubtopicDataTypes[]);

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (slug && posts) {
            fetchData();
        }
    }, [slug, posts]);

    useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            try {
                // Fetch all topics
                const { data: topicsData, error: topicsError } = await supabase
                    .from("topics")
                    .select("*");

                if (topicsError) throw topicsError;
                setTopics(topicsData);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    if (loading) return <p>Loading...</p>;
    

    return (
        <div className="">
            <h1 className="text-2xl md:text-4xl">{subtopic?.name}</h1>
            <p className="text-blue-200 text-sm mb-4">
                {topics?.find((tp) => tp.id === subtopic?.topic_id)?.name}
            </p>
            {filteredPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <div key={post.id}>
                        <PostCard post={post} />
                    </div>
                ))
            ) : (
                <p>No posts found for this subtopic...</p>
            )}
        </div>
    );
};

export default SubtopicPage;
