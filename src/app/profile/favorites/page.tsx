


"use client";
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import PostCard from '@/components/PostCard';
import supabase from '@/lib/supabaseClient';
import { PostWithAuthorAndSubtopicDataTypes } from '@/utils/types';

const UserFavorites = () => {
  const { setLoading, loading } = useFetchContext();
  const { currentUser } = useGeneralContext();
  const [favoriteList, setFavoriteList] = useState<PostWithAuthorAndSubtopicDataTypes[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!currentUser) return <p>Please log in to see your favorites.</p>;


  const getFavoritePosts = async () => {
    try {
      setLoading(true);

      // Kullanıcının favori post id'lerini çekiyoruz
      const { data: favoritePosts, error: favoritesError } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', currentUser?.id)
        .order('created_at', {ascending: false});


      if (favoritesError) throw favoritesError;

      // Favori post id'lerini bir diziye alıyoruz
      const postIds = favoritePosts.map((fav) => fav.post_id);

      // Favori post id'lerine göre posts tablosundan postları çekiyoruz
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
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
        .in('id', postIds)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setFavoriteList(postsData);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getFavoritePosts();
    }
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (favoriteList.length === 0) return <p className='text-orange-300 text-center'>You haven't favorited any posts yet.</p>;

  return (
    <div className='flex flex-col justify-center items-center mb-4'>
      {favoriteList.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserFavorites;
