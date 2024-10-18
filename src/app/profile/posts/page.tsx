"use client"
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import PostCard from '@/components/PostCard';
import { useGeneralContext } from '@/context/GeneralContext'; 
import { PostDataTypes } from '@/utils/types';
import supabase from '@/lib/supabaseClient';

const UserPosts = () => {
  const { posts, loading, setLoading, error } = useFetchContext(); 
  const { currentUser } = useGeneralContext(); 
  const [userPosts, setUserPosts] = useState<PostDataTypes[] | null>([]); 

  useEffect( () => {

      setLoading(true)
    const getUserPosts = async () => {
      try {
          const { data: userPostsData, error: userPostsDta } = await supabase
          .from("posts")
          .select()
          .eq("user_id", currentUser?.id)
          .order('created_at', {ascending: false})

          setUserPosts(userPostsData)
      } catch (error) {
          console.log(error);
      } finally {
        setLoading(false)
      }
    }
    getUserPosts()
  }, [currentUser, posts]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentUser) return <p>Please log in to see your posts.</p>; 

  return (
    <div className='flex flex-col items-center'>
      {userPosts?.length === 0 ? (
        <p>You have no posts yet.</p> 
      ) : (
        userPosts?.map((post) => <PostCard key={post.id} post={post} />) 
      )}
    </div>
  );
};

export default UserPosts;
