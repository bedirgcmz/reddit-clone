"use client"
import { useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { currentUser } = useGeneralContext();
  const { posts, comments, favorites } = useFetchContext();

  useEffect(() => {
    if (currentUser && !currentUser.image) {
      setTimeout(() => {
        Swal.fire({
          title: 'Complete Your Profile',
          text: 'Please update your profile with the missing information.',
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }, 2000);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className='text-orange text-xl'>Please log in to view this page.</div>;
  }

  const postCount = posts?.filter(post => post.user_id === currentUser.id).length || 0;
  const commentCount = comments?.filter(comment => comment.user_id === currentUser.id).length || 0;
  const favoriteCount = favorites?.filter(fav => fav.user_id === currentUser.id).length || 0;

  const renderProfileImage = () => {
    if (currentUser.image) {
      return <img src={currentUser.image} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white" />;
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
            <h3 className="text-xl font-bold">{postCount}</h3>
            <p>Posts</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{commentCount}</h3>
            <p>Comments</p>
          </div>
          <div>
            <h3 className="text-xl font-bold">{favoriteCount}</h3>
            <p>Favorites</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600">Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
