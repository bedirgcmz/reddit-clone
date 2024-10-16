"use client"
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import PostCard from '@/components/PostCard';
import { useGeneralContext } from '@/context/GeneralContext'; 
import { PostDataTypes } from '@/utils/types';

const UserPosts = () => {
  const { posts, loading, error } = useFetchContext(); 
  const { currentUser } = useGeneralContext(); 
  const [userPosts, setUserPosts] = useState<PostDataTypes[]>([]); 

  useEffect(() => {
    if (currentUser?.id && posts) {
      const filteredPosts = posts.filter((post) => post.user_id === currentUser.id);
      setUserPosts(filteredPosts);
    }
  }, [currentUser, posts]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentUser) return <p>Please log in to see your posts.</p>; 

  return (
    <div className='flex flex-col items-center'>
      {userPosts.length === 0 ? (
        <p>You have no posts yet.</p> 
      ) : (
        userPosts.map((post) => <PostCard key={post.id} post={post} />) 
      )}
    </div>
  );
};

export default UserPosts;
