"use client";
import { useFetchContext } from '@/context/FetchContext';
import PostCard from '@/components/PostCard';
export const dynamic = 'force-dynamic';

export default function Home() {
  const {
    posts,
    loading,
    error,
  } = useFetchContext();


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // posts dizisi üzerinde map fonksiyonu ile döngü yapıyoruz.
  return (
    <div className="">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
    </div>
  );
}