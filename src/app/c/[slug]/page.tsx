

"use client";
import { useEffect, useState } from "react";
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { timeAgo } from "@/utils/helpers"; 
import { TbPointFilled } from "react-icons/tb";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { Post_SubtopicsDataTypes, SubtopicsDataTypes, TopicsDataTypes } from "@/utils/types";
import InteractionBox from "@/components/InteractionBox";
import PostCard from "@/components/PostCard";
import CreateCommentInput from "@/components/CreateComment";

const SubtopicPage = ({ params }: { params: { slug: string } }) => {
  const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
    const [subtopicsParamSlug, setSubtopicsParamSlug] = useState(params.slug);
    const [subtopic, setSubtopic] = useState<SubtopicsDataTypes | null>(null);
    const [postSubtopic, setPostSubtopic] = useState<Post_SubtopicsDataTypes[] | null>([]);
    const {
        users,
        posts,
        loading,
        setLoading,
        error,
        setError,
        filteredPosts, 
        setFilteredPosts
    } = useFetchContext();
    const {currentUser} = useGeneralContext()

    const slug = params.slug
    useEffect(() =>{
        setSubtopicsParamSlug(slug)
    },[slug])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Reset states
                setSubtopic(null);
                setPostSubtopic([]);
                setFilteredPosts([]);

                // Fetch subtopic data
                const { data: subtopicData, error: subtopicError } = await supabase
                    .from('subtopics')
                    .select('*')
                    .eq('slug', subtopicsParamSlug)
                    .maybeSingle();

                if (subtopicError) throw subtopicError;
                if (!subtopicData) throw new Error(`No subtopic found for slug: ${subtopicsParamSlug}`);
                setSubtopic(subtopicData);

                // Fetch post_subtopics
                const { data: postSubtopicData, error: postSubtopicError } = await supabase
                    .from('post_subtopics')
                    .select('*')
                    .eq('subtopic_id', subtopicData.id);

                if (postSubtopicError) throw postSubtopicError;
                if (!postSubtopicData || postSubtopicData.length === 0) {
                    console.log(`No posts found for subtopic ID: ${subtopicData.id}`);
                    return; // Early return if no posts
                }
                setPostSubtopic(postSubtopicData);

                // Get post IDs and filter posts
                const postIds = postSubtopicData.map((ps) => ps.post_id);
                const filteredPostsData = posts?.filter(post => postIds.includes(post.id)) || [];
                setFilteredPosts(filteredPostsData); 

            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (subtopicsParamSlug && posts) {
            fetchData();
        }
    }, [subtopicsParamSlug, posts]);

    useEffect(() => {
        const fetchPosts = async () => {
          setLoading(true);
          try {
            // Tüm topics çekiyoruz
            const { data: topicsData, error: topicsError } = await supabase
              .from('topics')
              .select('*');
      
            if (topicsError) throw topicsError;
            if (!topicsData) throw new Error(`No topics found`);
            setTopics(topicsData); 
    
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
        };
      
        fetchPosts();
      }, [slug]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
            <div className="">
                <h1 className="text-2xl md:text-4xl">{subtopic?.name}</h1>
                <p className="text-blue-200 text-sm mb-4">{topics?.find((tp) => tp.id == subtopic?.topic_id)?.name}</p>
                {filteredPosts && filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id}>
                        <PostCard post={post} />
                        {currentUser && <CreateCommentInput singlePost={post} />}
                        </div>
                        ))
                ) : (
                    <p>No posts found for this subtopic......</p>
                )}
            </div>
    );
    
};

export default SubtopicPage;
