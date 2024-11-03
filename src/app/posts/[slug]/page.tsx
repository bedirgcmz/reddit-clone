// "use client";
// import { useEffect } from 'react';
// import { useFetchContext } from '@/context/FetchContext';
// import { useGeneralContext } from '@/context/GeneralContext';
// import CreateCommentInput from '@/components/CreateComment';
// import PostCard from '@/components/PostCard';
// import CommentsBox from '@/components/CommentsBox';
// import GoBackButton from '@/components/GoBackButton';
// import supabase from '@/lib/supabaseClient';

// const PostPage = ({ params }: { params: { slug: string } }) => {
//   const {
//     singlePost,
//     setSinglePost,
//     setPostParamsSlug,
//     comments, 
//     loading,
//     setLoading,
//     error,
//     setError,
//     posts
//   } = useFetchContext();
//   const { currentUser } = useGeneralContext()

//   const slug = params.slug;

//   const getSinglePost = async () => {
//     setLoading(true);
//     try {
//       // 1. Adım: Post verisini slug'a göre alıyoruz
//       const { data: postData, error: postError } = await supabase
//         .from('posts')
//         .select('*')
//         .eq('slug', slug)
//         .maybeSingle();

//       if (postError) throw postError;
//       if (!postData) throw new Error(`No post found for the provided slug: ${slug}`);
//       setSinglePost(postData);

//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setPostParamsSlug(slug);
//     getSinglePost()
//   }, [slug, setPostParamsSlug, posts]);

  

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   const targetPostsComments = comments?.filter((e) => e.post_id == singlePost?.id)

//   return (
//     <div className='w-full lg:w-[700px] relative'>
//       <span className='absolute top-[10px] right-[20px] text-xl bg-gray-200 hover:bg-gray-400 text-orange-200 h-8 w-8 rounded-full flex items-center justify-center'>
//         <GoBackButton />
//       </span>
//       {singlePost ? (
//         <>
//           <PostCard post={singlePost} />
//           {currentUser && <CreateCommentInput singlePost={singlePost}  />}
//           <div className='ml-2 w-full lg:w-[700px] '><CommentsBox commentsProps={targetPostsComments}  /></div>
//         </>
//       ) : (
//         <p>No post found</p>
//       )}
//     </div>
//   );
// };

// export default PostPage;
// //overflow-x-scroll

"use client";
import { useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import CreateCommentInput from '@/components/CreateComment';
import PostCard from '@/components/PostCard';
import CommentsBox from '@/components/CommentsBox';
import GoBackButton from '@/components/GoBackButton';
import supabase from '@/lib/supabaseClient';
import { PostWithAuthorDataTypes } from '@/utils/types';

const PostPage = ({ params }: { params: { slug: string } }) => {
  const {
    singlePost,
    setSinglePost,
    setPostParamsSlug,
    comments, 
    loading,
    setLoading,
    error,
    setError,
  } = useFetchContext();
  const { currentUser } = useGeneralContext();

  const slug = params.slug;

  const getSinglePostWithAuthor = async () => {
    setLoading(true);
    try {
      // 1. Adım: Post ve author bilgilerini slug'a göre alıyoruz
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          author:users (
            id,
            username,
            image
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (postError) throw postError;
      if (!postData) throw new Error(`No post found for the provided slug: ${slug}`);
      
      setSinglePost(postData as PostWithAuthorDataTypes); // Tip dönüşümü

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPostParamsSlug(slug);
    getSinglePostWithAuthor();
  }, [slug, setPostParamsSlug]);

  if (loading) return <p>Loading...</p>;

  const targetPostsComments = comments?.filter((e) => e.post_id == singlePost?.id);

  return (
    <div className='w-full lg:w-[700px] relative'>
      <span className='absolute top-[10px] right-[20px] text-xl bg-gray-200 hover:bg-gray-400 text-orange-200 h-8 w-8 rounded-full flex items-center justify-center'>
        <GoBackButton />
      </span>
      {singlePost ? (
        <>
          <PostCard post={singlePost} /> {/* Artık author bilgileri ile post'u aktarabilirsiniz */}
          {currentUser && <CreateCommentInput singlePost={singlePost} />}
          <div className='ml-2 w-full lg:w-[700px]'>
            <CommentsBox commentsProps={targetPostsComments} />
          </div>
        </>
      ) : (
        <p>No post found</p>
      )}
    </div>
  );
};

export default PostPage;
