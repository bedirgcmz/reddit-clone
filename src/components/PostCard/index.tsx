import { PostDataTypes } from '@/utils/types';
import React from 'react'
import { TbPointFilled } from 'react-icons/tb';
import InteractionBox from '../InteractionBox';
import Link from 'next/link';
import { timeAgo } from '@/utils/helpers';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import CreateCommentInput from '../CreateComment';

type PostCardProps = {
    post: PostDataTypes;
  };
  
const PostCard: React.FC<PostCardProps>  = ({post}) => {
    const {
        setPostParamsSlug,
        comments, 
        setComments,
        users, 
        setUsers,
        loading,
        error,
      } = useFetchContext();
      const {
        currentUser
      } = useGeneralContext();
  return (
    <div key={post.id} className="hover:bg-gray-100 rounded-lg p-4 w-full lg:w-[700px]">
        <h5 className='flex justify-start items-center mb-[14px]'>
        <img className='rounded-full me-2 h-[20px] w-[20px]' src={ users?.find((user) => user.id == post.user_id)?.image } alt="user"/> 
        <span>
        r/{ users?.find((user) => user.id == post.user_id)?.username }
        </span>
        <TbPointFilled className='mx-2 text-[8px] text-gray-600'></TbPointFilled>
        <span className='text-xs text-gray-500'>
            {timeAgo(post.created_at)}
        </span>
        </h5>
        <div>
        <Link legacyBehavior href={`/posts/${post.slug}`}>
            <h2 className='mb-2 w-full cursor-pointer'>{post.title}</h2>
        </Link>
            <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg object-cover max-h-[500px]" />
            <InteractionBox singlePost={post} />
            
        </div>
    </div>
  )
}

export default PostCard