"use client";
import { useFetchContext } from '@/context/FetchContext';
import PostCard from '@/components/PostCard';
import { useEffect } from 'react';
export const dynamic = 'force-dynamic';

export default function Home() {
  const {
    posts,
    loading,
    error,
    setError
  } = useFetchContext();

  useEffect(() => {
    if(posts) setError(null)
  },[])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // posts dizisi üzerinde map fonksiyonu ile döngü yapıyoruz.
  return (
    <div className="">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
    </div>
  );
}