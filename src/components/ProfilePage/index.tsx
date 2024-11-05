"use client"
import { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import Swal from 'sweetalert2';
import { FavoritesDataTypes } from '@/utils/types';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';

const ProfilePage = () => {
  const { currentUser, favorites, setfavorites } = useGeneralContext();
  // const { setError, setLoading } = useFetchContext();
  // const [favorites, setfavorites] = useState<FavoritesDataTypes[] | null>([])
  const [commentsCount, setCommentsCount] = useState<number | null>(0)
  const [postsCount, setPostsCount] = useState<number | null>(0)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFavorites = async () => {
    try {
       // Tum Comments verilerini alalim
       const { data: favoritesData, error: favoritesError } = await supabase
       .from('favorites')
       .select('*') 
       .order('created_at', {ascending: false})
       
       if (favoritesError) throw favoritesError;
       if (!favoritesData) throw new Error(`No favorites found`);
       setfavorites(favoritesData); 
      
   } catch (err) {
      setError((err as Error).message);
  } finally {
    setLoading(false);
  }
}

  // useEffect(() => {
  //   if (currentUser && !currentUser.image) {
  //     setTimeout(() => {
  //       Swal.fire({
  //         title: 'Complete Your Profile',
  //         text: 'Please update your profile with the missing information.',
  //         icon: 'info',
  //         confirmButtonText: 'OK',
  //       });
  //     }, 2000);
  //   }
  //   getFavorites()
  // }, [currentUser]);

 

 // Fetch comments count
 const fetchCommentsCount = async () => {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", currentUser?.id);

  if (error) {
    console.error("Error fetching comments count:", error.message);
  } else {
    setCommentsCount(count || 0);
  }
};

// Fetch posts count
const fetchPostsCount = async () => {
  const { count, error } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", currentUser?.id);

  if (error) {
    console.error("Error fetching posts count:", error.message);
  } else {
    setPostsCount(count || 0);
  }
};

useEffect(() => {
    if (currentUser?.id) {
      fetchCommentsCount();
      fetchPostsCount();
      getFavorites()
      setLoading(false)
    }
  
}, [currentUser]);

  // const favoriteCount = currentUser && favorites?.filter(fav => fav.user_id === currentUser.id).length || 0;
  if (!currentUser) {
    return <div className='text-orange text-xl'>Please log in to view this page.</div>;
  } 
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red text-xl'>{error}</div>;
  }

  const renderProfileImage = () => {
    if (currentUser.image) {
      return <img src={currentUser.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white object-cover" />;
    }
    return (
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-500 text-white text-xl">
        {currentUser.fullname ? currentUser.fullname[0] : currentUser.email[0]}
      </div>
    );
  };

  return (
    <div className="flex flex-column justify-start items-center pb-8 bg-white max-h-[600px]">
        
      <div className="bg-orange-500 w-[98%] h-60 ">
      </div>
      <div className="relative flex justify-center bg-white w-[98%]  min-h-[100px] mt-[-40px] rounded-tl-[2rem] rounded-tr-[2rem]">
        <div className="absolute w-[96%] max-w-[600px] h-48 bg-white top-[-6rem] rounded-tl-[2rem] rounded-tr-[2rem] shadow-md flex flex-col items-center justify-center">
            <div className="relative -top-16">{renderProfileImage()}</div>
            <h2 className="text-2xl font-semibold">{currentUser.fullname || currentUser.email}</h2>
            <p className="text-gray-500">{currentUser.username}</p>
        </div>
      </div>

      <div className="mt-16 w-full max-w-md">
        <div className="grid grid-cols-3 text-center">
          <div>
            <h3 className="text-xl font-bold">{postsCount}</h3>
            <p>Posts</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{commentsCount}</h3>
            <p>Comments</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{favorites?.filter(fav => fav.user_id === currentUser.id).length || 0}</h3>
            <p>Favorites</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/profile/account" >
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600">Update Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
