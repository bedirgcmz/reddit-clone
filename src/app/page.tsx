"use client";
import { useFetchContext } from '@/context/FetchContext';
import PostCard from '@/components/PostCard';
import { useEffect, useState } from 'react';
export const dynamic = 'force-dynamic';
import supabase from '@/lib/supabaseClient';
import { PostWithAuthorDataTypes } from '@/utils/types';

export default function Home() {
  const {loading} = useFetchContext();

  const [postsWithAuthors, setPostsWithAuthors] = useState<PostWithAuthorDataTypes[] | null>([]);

  const getPostsWithAuthors = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, users (username, image)');
  
    if (error) {
      console.error("Error fetching posts with authors:", error);
      return;
    }
  
    // postsWithAuthors state'ini güncellemek için veri tipini uygun hale getiriyoruz
    const formattedData = data.map((post) => ({
      ...post,
      author: post.users,
    })) as PostWithAuthorDataTypes[];
  
    setPostsWithAuthors(formattedData);
  };

  useEffect(() => {
    getPostsWithAuthors();
  }, []);


  if (loading) return <p>Loading...</p>;
  if (postsWithAuthors?.length == 0 ) return <p className='text-orange-300'>We couldn't find any posts for this search. Try a new search.</p>;

  // posts dizisi üzerinde map fonksiyonu ile döngü yapıyoruz.
  return (
    <div className="">
        {postsWithAuthors?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
    </div>
  );
}