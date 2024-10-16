"use client";
import { useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import CreateCommentInput from '@/components/CreateComment';
import PostCard from '@/components/PostCard';
import CommentsBox from '@/components/CommentsBox';

const PostPage = ({ params }: { params: { slug: string } }) => {
  const {
    singlePost,
    setPostParamsSlug,
    comments, 
    setComments,
    users, 
    setUsers,
    loading,
    error,
  } = useFetchContext();
  const { currentUser } = useGeneralContext()

  const slug = params.slug;

  useEffect(() => {
    setPostParamsSlug(slug);
  }, [slug, setPostParamsSlug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const targetPostsComments = comments?.filter((e) => e.post_id == singlePost?.id)

  return (
    <div className='w-full lg:w-[700px]'>
      {singlePost ? (
        <>
          <PostCard post={singlePost} />
          {currentUser && <CreateCommentInput singlePost={singlePost} />}
          <CommentsBox commentsProps={targetPostsComments} />
        </>
      ) : (
        <p>No post found</p>
      )}
    </div>
  );
};

export default PostPage;
