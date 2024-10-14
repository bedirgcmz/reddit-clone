"use client";
import { useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { TbPointFilled } from 'react-icons/tb';
import { sortCommentsByDate, timeAgo } from '@/utils/helpers';
import Link from 'next/link';
import InteractionBox from '@/components/InteractionBox';

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

//   const targetPostsComments =sortCommentsByDate( (comments || [])?.filter((e) => e.post_id == singlePost?.id)).reverse()
  const targetPostsComments = comments ?.filter((e) => e.post_id == singlePost?.id)

  return (
    <div className='mt-[70px]'>
      {singlePost ? (
        <>
         <div key={singlePost.id} className="hover:bg-gray-100 rounded-lg p-4 mb-[20px] md:ms-2 w-full lg:w-[700px]">
              <h5 className='flex justify-start items-center mb-[14px]'>
                <img className='rounded-full me-2 h-[20px] w-[20px]' src={ users?.find((user) => user.id == singlePost.user_id)?.image } alt="user" /> 
                <span>
                r/{ users?.find((user) => user.id == singlePost.user_id)?.username }
                </span>
                <TbPointFilled className='mx-2 text-[8px] text-gray-600'></TbPointFilled>
                <span className='text-xs text-gray-500'>
                  {timeAgo(singlePost.created_at)}
                </span>
              </h5>
            <div>
            <Link legacyBehavior href={`/posts/${singlePost.slug}`}>
              <h2 className='mb-2 w-full cursor-pointer'>{singlePost.title}</h2>
            </Link>
              <img src={singlePost.image} alt={singlePost.title} className="w-full h-auto rounded-lg" />
              <InteractionBox singlePost={singlePost} />
            </div>
            <ul className="comments mt-8 ps-4">
            {
                targetPostsComments?.reverse().map((comment) => (
                        <li className='p-2 ps-4 pt-4 relative flex flex-col'>
                            {
                            <span className='absolute top-0 left-0 flex items-center'>
                                    <img className='rounded-full me-2 h-[20px] w-[20px]' src={ users?.find((e) => e.id == comment.user_id)?.image } alt="user" /> 
                                    <span className='text-sm'>@{users?.find((e) => e.id == comment.user_id)?.username}</span>
                                    <TbPointFilled className='mx-2 text-[8px] text-gray-600'></TbPointFilled>
                                    <span className='text-xs text-gray-500'>
                                    {timeAgo(comment.created_at)}
                                    </span> 
                                
                            </span>
                            }
                            <p className='text-sm text-gray-800'>
                            {comment.content}
                            </p>
                            
                        </li>
                ))
            }
            </ul>
          </div>
        </>
      ) : (
        <p>No post found</p>
      )}
    </div>
  );
};

export default PostPage;
