
"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '@/lib/supabaseClient';
import { PostDataTypes, FetchContextType, CommentsDataTypes, UsersDataTypes, FavoritesDataTypes, SubtopicsDataTypes, TopicsDataTypes } from '@/utils/types';

// Başlangıç değerleri
const FetchContext = createContext<FetchContextType | undefined>(undefined);

// Provider bileşeni oluşturma
export const FetchProvider = ({ children }: { children: ReactNode }) => {
  const [singlePost, setSinglePost] = useState<PostDataTypes | null>(null);
  const [posts, setPosts] = useState<PostDataTypes[] | null>([]);
  const [comments, setComments] = useState<CommentsDataTypes[] | null>([]);
  const [favorites, setFavorites] = useState<FavoritesDataTypes[] | null>([]);
  const [subtopics, setSubtopics] = useState<SubtopicsDataTypes[] | null>([]);
  const [topics, setTopics] = useState<TopicsDataTypes[] | null>([]);
  const [users, setUsers] = useState<UsersDataTypes[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postParamsSlug, setPostParamsSlug] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<PostDataTypes[] | null>([]);


  const getComments = async () => {
      try {
         // Tum Comments verilerini alalim
         const { data: commentsData, error: commentsError } = await supabase
         .from('comments')
         .select('*') 
         .order('created_at', {ascending: false})
         
         if (commentsError) throw commentsError;
         if (!commentsData) throw new Error(`No comment found`);
         setComments(commentsData); 
        
     } catch (err) {
        setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }
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
  const getUsers = async () => {
    try {
        // Tum Users verilerini alalim
        const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*') 
        if (usersError) throw usersError;
        if (!usersData) throw new Error(`No users found`);
        setUsers(usersData); 
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
    getUsers()
    getPosts()
    getComments()
    getSubtopics() 
    getTopics()
}, [setComments, setPosts]);

  
  return (
    <FetchContext.Provider value={{
      singlePost,
      setSinglePost,
      // getSinglePost,
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
