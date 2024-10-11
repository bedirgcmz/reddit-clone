"use client";
import { useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';

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

  const slug = params.slug;

  useEffect(() => {
    setPostParamsSlug(slug);
  }, [slug, setPostParamsSlug]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const targetPostsComments = comments?.filter((e) => e.post_id == singlePost?.id)

  return (
    <div className='mt-[70px]'>
      {singlePost ? (
        <>
        <div className='post-card'>
          <p>Created by user: {users ? users.find((e) => e.id == singlePost.user_id)?.fullname : 'Unknown Author'}</p>
          <h1>{singlePost.title}</h1>
          <img src={singlePost.image} alt={singlePost.title} style={{ width: '300px', height: 'auto' }} />
          <p>{singlePost.content}</p>
          {/* Yazar adı eklendi */}
        </div>
        <ul className="comments ">
        {
            targetPostsComments?.map((comment) => (
                    <li className='p-2 ps-4 pt-4 relative'>
                        <span className='absolute top-0  left-0'>@
                        {
                        users?.find((e) => e.id == comment.user_id)?.username
                        }</span>
                        {comment.content}
                        <span className='absolute bottom-0 right-0 text-gray-300 text-sm'>{new Date(comment.created_at).toLocaleDateString()}</span>
                        
                    </li>
            ))
        }
        </ul>
        </>
      ) : (
        <p>No post found</p>
      )}
    </div>
  );
};

export default PostPage;
