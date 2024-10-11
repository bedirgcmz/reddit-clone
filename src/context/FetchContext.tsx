// src/context/FetchContext.tsx
"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import supabase from '@/lib/supabaseClient';
import { UserDataTypes, PostDataTypes, FetchContextType, CommentsDataTypes, UsersDataTypes } from '@/utils/types';

// Başlangıç değerleri
const FetchContext = createContext<FetchContextType | undefined>(undefined);

// Provider bileşeni oluşturma
export const FetchProvider = ({ children }: { children: ReactNode }) => {
  const [singlePost, setSinglePost] = useState<PostDataTypes | null>(null);
  const [posts, setPosts] = useState<PostDataTypes[] | null>([]);
  const [comments, setComments] = useState<CommentsDataTypes[] | null>([]);
  const [users, setUsers] = useState<UsersDataTypes[] | null>([]);
//   const [author, setAuthor] = useState<UserDataTypes | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postParamsSlug, setPostParamsSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostAndAuthor = async () => {
      setLoading(true);
      try {
        // 1. Adım: Post verisini slug'a göre alıyoruz
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', postParamsSlug)
          .maybeSingle();

        if (postError) throw postError;
        if (!postData) throw new Error(`No post found for the provided slug: ${postParamsSlug}`);
        setSinglePost(postData);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (postParamsSlug) {
      fetchPostAndAuthor();
    }
  }, [postParamsSlug]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Tüm posts çekiyoruz
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*');
  
        if (postsError) throw postsError;
        if (!postsData) throw new Error(`No posts found`);
        setPosts(postsData); 

          // Tum Comments verilerini alalim
          const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*') 
          
          if (commentsError) throw commentsError;
          if (!commentsData) throw new Error(`No comment found`);
          setComments(commentsData); 
  
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
    };
  
    fetchPosts();
  }, []);
  

  
  return (
    <FetchContext.Provider value={{
      singlePost,
      setSinglePost,
      postParamsSlug,
      setPostParamsSlug,
      comments, 
      setComments,
      users, 
      setUsers,
      posts, 
      setPosts,
      loading,
      error
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
