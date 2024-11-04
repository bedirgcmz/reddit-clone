

"use client";
import { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import CreateCommentInput from '@/components/CreateComment';
import PostCard from '@/components/PostCard';
import CommentsBox from '@/components/CommentsBox';
import GoBackButton from '@/components/GoBackButton';
import supabase from '@/lib/supabaseClient';
import { CommentWithAuthorDataTypes, PostWithAuthorDataTypes } from '@/utils/types';

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
  const [targetPostsComments, setTargetPostsComments] = useState<CommentWithAuthorDataTypes[] | undefined>(undefined);

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

  const fetchCommentsForPost = async () => {
    
    
    if (!singlePost?.id) return;
    
    const { data, error } = await supabase
    .from('comments')
    .select(`
    id, content, user_id, post_id, parent_id, created_at, updated_at,
    users: user_id (username, image)
    `)
    .eq('post_id', singlePost.id)
    .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching comments:', error.message);
      return;
    }
    
    if (data) {
      const formattedComments = data.map((comment) => ({
        ...comment,
        author: comment.users,
      }));
      setTargetPostsComments(formattedComments as unknown as CommentWithAuthorDataTypes[]);
      
    }
  };


  useEffect(() => {
    setPostParamsSlug(slug);
    getSinglePostWithAuthor();
  }, [slug, setPostParamsSlug]);

  useEffect(() => {
    if (singlePost?.id) {
      fetchCommentsForPost();
    }
  }, [singlePost, comments]);

  if (loading) return <p>Loading...</p>;


  
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
