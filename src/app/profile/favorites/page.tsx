"use client"
import PostCard from '@/components/PostCard'
import React, { useEffect, useState } from 'react'
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from '@/context/GeneralContext';
import supabase from '@/lib/supabaseClient';
import { PostDataTypes } from '@/utils/types';
import { log } from 'console';

const UserFavorites = () => {
  const { setError, setLoading } = useFetchContext();
  const { currentUser } = useGeneralContext();
  const [favoriteList, setFavoriteList] = useState<PostDataTypes[] | null>([]);

  const getFavoritePosts = async () => {
    try {
      setLoading(true);

      // Favorites tablosundan kullanıcının favori post id'lerini çekiyoruz
      const { data: favoritePosts, error: favoritesError } = await supabase
        .from('favorites')
        .select('post_id')
        .eq('user_id', currentUser?.id);

      if (favoritesError) throw favoritesError;
      if (!favoritePosts || favoritePosts.length === 0) throw new Error("No favorite posts found");

      // favoritePosts [{post_id: djijsdi}...] seklinde geliyor. Onu bir id arrey haline getiriyoruz
      const postIds = favoritePosts.map((fav) => fav.post_id);
      
      
      // Favori post id'lerine göre posts tablosundan postları çekiyoruz
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('id', postIds) //Burada id sutununa bakiyoruz ve eger postIds dizisinden biri ile eslesirse, onu getiriyoruz.
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      if (!postsData || postsData.length === 0) throw new Error("No posts found");

      setFavoriteList(postsData);
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

  return (
    <div className='flex flex-col justify-center items-center'>
      {favoriteList?.map((fv) => (
        <PostCard key={fv.id} post={fv} />
      ))}
    </div>
  );
};

export default UserFavorites;
