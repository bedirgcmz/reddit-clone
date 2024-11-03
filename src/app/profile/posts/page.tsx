

"use client";
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import PostCard from '@/components/PostCard';
import { useGeneralContext } from '@/context/GeneralContext'; 
import { PostWithAuthorAndSubtopicDataTypes } from '@/utils/types'; // Gerekli türü import edin
import supabase from '@/lib/supabaseClient';

const UserPosts = () => {
  const { loading, setLoading } = useFetchContext(); 
  const { currentUser } = useGeneralContext(); 
  const [userPosts, setUserPosts] = useState<PostWithAuthorAndSubtopicDataTypes[] | null>(null); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const getUserPosts = async () => {
      try {
        const { data: userPostsData, error: userPostsError } = await supabase
          .from("posts")
          .select(`
            *,
            author:users (
              id,
              username,
              image
            ),
            subtopic:post_subtopics (
              id,
              subtopic_id,
              subtopic:subtopics (
                id,
                name,
                topic:topics (
                  id,
                  name
                )
              )
            )
          `)
          .eq("user_id", currentUser?.id)
          .order('created_at', { ascending: false });

        if (userPostsError) throw userPostsError;

        setUserPosts(userPostsData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getUserPosts();
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!currentUser) return <p>Please log in to see your posts.</p>;

  return (
    <div className='flex flex-col items-center mb-4'>
      {!userPosts || userPosts.length === 0 ? (
        <p>You have no posts yet.</p>
      ) : (
        userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default UserPosts;
