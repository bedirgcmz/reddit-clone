"use client";
import { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { timeAgo } from "@/utils/helpers"; 
import { TbPointFilled } from "react-icons/tb";
import Link from 'next/link';
import CreatePostModalButton from '@/components/CreatePostModalButton';
import InteractionBox from '@/components/InteractionBox';

export default function Home() {
  const {
    comments, 
    setComments,
    users, 
    setUsers,
    posts,
    setPosts,
    loading,
    error,
  } = useFetchContext();



  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // posts dizisi üzerinde map fonksiyonu ile döngü yapıyoruz.
  return (
    <div className="">
      <div className=''>
        {posts?.map((post) => (
          <div key={post.id} className="hover:bg-gray-100 rounded-lg p-4 mb-[20px] md:ms-2 w-full lg:w-[700px]">
              <h5 className='flex justify-start items-center mb-[14px]'>
                <img className='rounded-full me-2 h-[20px] w-[20px]' src={ users?.find((user) => user.id == post.user_id)?.image } alt="user"/> 
                <span>
                r/{ users?.find((user) => user.id == post.user_id)?.username }
                </span>
                <TbPointFilled className='mx-2 text-[8px] text-gray-600'></TbPointFilled>
                <span className='text-xs text-gray-500'>
                  {timeAgo(post.created_at)}
                </span>
              </h5>
            <div>
            <Link legacyBehavior href={`/posts/${post.slug}`}>
              <h2 className='mb-2 w-full cursor-pointer'>{post.title}</h2>
            </Link>
              <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg" />
              <InteractionBox singlePost={post} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}