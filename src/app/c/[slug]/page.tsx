


// "use client";
// import { createContext, useEffect, useState } from "react";
// import { useFetchContext } from "@/context/FetchContext";
// import { timeAgo } from "@/utils/helpers"; 
// import { TbPointFilled } from "react-icons/tb";
// import Link from "next/link";
// import supabase from "@/lib/supabaseClient";
// import { Post_SubtopicsDataTypes, SubtopicsDataTypes } from "@/utils/types";


// const SubtopicPage = ({ params }: { params: { slug: string } }) => {
//     const [subtopicsParamSlug, setSubtopicsParamSlug] = useState("");
//     const [subtopic, setSubtopic] = useState<SubtopicsDataTypes | null>(null);
//     const [postSubtopic, setPostSubtopic] = useState<Post_SubtopicsDataTypes[] | null>([]);
//     const {
//         users,
//         posts,
//         setPosts,
//         loading,
//         setLoading,
//         error,
//         setError,
//         filteredPosts, 
//         setFilteredPosts
//     } = useFetchContext();

//     const slug = params.slug;

//     useEffect(() => {
//       setSubtopicsParamSlug(slug);
      
//     }, [slug]);
   

//     useEffect(() => {
//         const fetchData = async () => {
//           setLoading(true);
//           try {
//             // Durumları sıfırla
//             setSubtopic(null);
//             setPostSubtopic([]);
//             setFilteredPosts([]);
      
//             // Slug'a göre subtopic verisini getir
//             const { data: subtopicData, error: subtopicError } = await supabase
//               .from('subtopics')
//               .select('*')
//               .eq('slug', subtopicsParamSlug)
//               .maybeSingle();
            
//             if (subtopicError) throw subtopicError;
//             if (!subtopicData) throw new Error(`No subtopics found`);
//             setSubtopic(subtopicData);
            
      
//             // Post_subtopics ve post verilerini getir
//             if (subtopicData?.id) {
//               const { data: postSubtopicData, error: postSubtopicError } = await supabase
//                 .from('post_subtopics')
//                 .select('*')
//                 .eq('subtopic_id', subtopicData.id);
      
//               if (postSubtopicError) throw postSubtopicError;
//               if (!postSubtopicData || postSubtopicData.length === 0) throw new Error(`No posts found for this subtopic`);
//               setPostSubtopic(postSubtopicData);
              
//               const postIds = postSubtopic?.map((ps) => ps.post_id);
//               const filteredPostsData = posts?.filter(post => postIds?.includes(post.id)) || null; // Use null as a fallback
//               setFilteredPosts(filteredPostsData); 
//               console.log(filteredPostsData);

//             }
      
//           } catch (err) {
//             setError((err as Error).message);
//           } finally {
//             setLoading(false);
//           }
//         };
      
//         // Eğer slug değişmişse ve postlar varsa, veriyi yeniden çek
//         if (subtopicsParamSlug && posts) {
//           fetchData();
//         }

//       }, [subtopicsParamSlug, posts]);

       
      

      

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//       <div className="">
//         <div className="">
//           {filteredPosts && filteredPosts?.map((post) => (
//             <div key={post.id} className="hover:bg-gray-100 rounded-lg p-4 mb-[20px] ms-2 w-full lg:w-[700px]">
//               <h5 className="flex justify-start items-center mb-[14px]">
//                 <img
//                   className="rounded-full me-2"
//                   src={users?.find((user) => user.id == post.user_id)?.image}
//                   alt="user"
//                   width={20}
//                 />
//                 <span>
//                   r/{users?.find((user) => user.id == post.user_id)?.username}
//                 </span>
//                 <TbPointFilled className="mx-2 text-[8px] text-gray-600"></TbPointFilled>
//                 <span className="text-xs text-gray-500">
//                   {timeAgo(post.created_at)}
//                 </span>
//               </h5>
//               <div>
//                 <Link legacyBehavior href={`posts/${post.slug}`}>
//                   <h2 className="mb-2 w-full cursor-pointer">{post.title}</h2>
//                 </Link>
//                 {post.image && (
//                   <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
// };

// export default SubtopicPage;

"use client";
import { useEffect, useState } from "react";
import { useFetchContext } from "@/context/FetchContext";
import { timeAgo } from "@/utils/helpers"; 
import { TbPointFilled } from "react-icons/tb";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import { Post_SubtopicsDataTypes, SubtopicsDataTypes, TopicsDataTypes } from "@/utils/types";

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
                console.log("Filtered Posts:", filteredPostsData);

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
            <div className="">
                <h1 className="text-2xl md:text-4xl">{subtopic?.name}</h1>
                <p className="text-blue-200 text-sm mb-4">{topics?.find((tp) => tp.id == subtopic?.topic_id)?.name}</p>
                {filteredPosts && filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post.id} className="hover:bg-gray-100 rounded-lg p-4 mb-[20px] w-full lg:w-[700px]">
                            <h5 className="flex justify-start items-center mb-[14px]">
                                <img
                                    className="rounded-full me-2"
                                    src={users?.find((user) => user.id === post.user_id)?.image}
                                    alt="user"
                                    width={20}
                                />
                                <span>
                                    r/{users?.find((user) => user.id === post.user_id)?.username}
                                </span>
                                <TbPointFilled className="mx-2 text-[8px] text-gray-600" />
                                <span className="text-xs text-gray-500">
                                    {timeAgo(post.created_at)}
                                </span>
                            </h5>
                            <div>
                                <Link legacyBehavior href={`posts/${post.slug}`}>
                                    <h2 className="mb-2 w-full cursor-pointer">{post.title}</h2>
                                </Link>
                                {post.image && (
                                    <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg" />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts found for this subtopic......</p>
                )}
            </div>
        </div>
    );
    
};

export default SubtopicPage;
