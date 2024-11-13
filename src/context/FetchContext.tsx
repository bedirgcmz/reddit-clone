
"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '@/lib/supabaseClient';
import { PostDataTypes, FetchContextType, UsersDataTypes, FavoritesDataTypes, SubtopicsDataTypes, TopicsDataTypes, PostWithAuthorDataTypes, CommentWithAuthorDataTypes, PostWithAuthorAndSubtopicDataTypes } from '@/utils/types';

// Başlangıç değerleri
const FetchContext = createContext<FetchContextType | undefined>(undefined);

// Provider bileşeni oluşturma
export const FetchProvider = ({ children }: { children: ReactNode }) => {
  const [singlePost, setSinglePost] = useState<PostWithAuthorDataTypes | null>(null);
  const [posts, setPosts] = useState<PostDataTypes[] | null>([]);
  const [comments, setComments] = useState<CommentWithAuthorDataTypes[] | null>([]);
  const [favorites, setFavorites] = useState<FavoritesDataTypes[] | null>([]);
  const [subtopics, setSubtopics] = useState<SubtopicsDataTypes[] | null>([]);
  const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
  const [users, setUsers] = useState<UsersDataTypes[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postParamsSlug, setPostParamsSlug] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostWithAuthorAndSubtopicDataTypes[] | null>([]);
  const [postsWithAuthors, setPostsWithAuthors] = useState<PostWithAuthorDataTypes[] | null>([]);


  const getComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id, content, user_id, post_id, parent_id, created_at, updated_at,
          users: user_id (username, image)
        `);
  
      if (error) throw error;
  
      // Format comments to include author data
      const formattedComments = data.map(comment => ({
        ...comment,
        author: comment.users,
      }));
  
      setComments(formattedComments as unknown as CommentWithAuthorDataTypes[]);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  
  const getPosts = async () => {
    try {
          // Tüm posts çekiyoruz
          const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', {ascending: false})
  
        if (postsError) throw postsError;
        if (!postsData) throw new Error(`No posts found`);
        setPosts(postsData); 
    } catch (err) {
       setError((err as Error).message);
   } finally {
     setLoading(false);
   }
  }
 
  const getTopics = async () => {
    try {
        // Tum Topics verilerini alalim
        const { data: subtopicsData, error: subtopicsError } = await supabase
        .from('topics')
        .select() 
        
        if (subtopicsError) throw subtopicsError;
        if (!subtopicsData) throw new Error(`No favorites found`);
        setTopics(subtopicsData); 
    } catch (err) {
       setError((err as Error).message);
   } finally {
     setLoading(false);
   }
  }

  const getSubtopics = async () => {
    try {
         // Tum Subtopics verilerini alalim
         const { data: subtopicsData, error: subtopicsError } = await supabase
         .from('subtopics')
         .select() 
         
         if (subtopicsError) throw subtopicsError;
         if (!subtopicsData) throw new Error(`No favorites found`);
         setSubtopics(subtopicsData); 
    } catch (err) {
       setError((err as Error).message);
   } finally {
     setLoading(false);
   }
  }
  
  useEffect(() => {
    setLoading(true);
    getComments()
    getSubtopics() 
    getTopics()
}, [setComments, setPosts]);

  
  return (
    <FetchContext.Provider value={{
      singlePost,
      setSinglePost,
      postParamsSlug,
      setPostParamsSlug,
      comments, 
      setComments,
      favorites,
      setFavorites,
      subtopics,
      setSubtopics,
      topics,
      setTopics,
      users, 
      setUsers,
      posts, 
      setPosts,
      loading,
      setLoading,
      error,
      setError,
      filteredPosts,
      setFilteredPosts,
      getPosts,
      getComments,
      postsWithAuthors, 
      setPostsWithAuthors
    }}>
      {children}
    </FetchContext.Provider>
  );
};

// Custom hook ile FetchContext'i kolayca kullanma
export const useFetchContext = () => {
  const context = useContext(FetchContext);
  if (context === undefined) {
    throw new Error("useFetchContext must be used within a FetchProvider");
  }
  return context;
};
