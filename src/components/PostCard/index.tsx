
import { PostDataTypes } from '@/utils/types';
import React, { useState } from 'react';
import { TbPointFilled } from 'react-icons/tb';
import InteractionBox from '../InteractionBox';
import Link from 'next/link';
import { timeAgo } from '@/utils/helpers';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import { FaEdit } from 'react-icons/fa';
import UpdatePostModal from '../UpdatePostModal'; // Modal bileşenini içe aktar
import supabase from '@/lib/supabaseClient';
import { toast } from 'sonner'


type PostCardProps = {
    post: PostDataTypes;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const {
        users,
        posts,
        getPosts
    } = useFetchContext();
    const { currentUser } = useGeneralContext();

    const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false); 


  // Post güncelleme fonksiyonu
  const updatePostByOwner = async (postId: string, updatedData: { title?: string; content?: string; image?: File | null }) => {
    try {
      let imageUrl = null;

      if (updatedData.image) {
        
        const fileName = `${Date.now()}-${updatedData.image.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, updatedData.image);

        if (uploadError) throw uploadError;

        // Public URL'yi al
        imageUrl = supabase.storage.from("post-images").getPublicUrl(fileName).data.publicUrl;
      } else {
        imageUrl = posts?.find((pt) => pt.id == postId)?.image
      }

      const { data: postData, error: postError } = await supabase
        .from("posts")
        .update({
          title: updatedData.title,
          content: updatedData.content,
          image: imageUrl,
          updated_at: new Date(), 
        })
        .eq('id', postId); 

      if (postError) throw postError;
      
      toast.success('Post has been updated')
      getPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };


    return (
        <div key={post.id} className="hover:bg-gray-100 rounded-lg p-4 pb-0 w-full lg:w-[700px]">
            <h5 className='flex justify-start items-center mb-[14px]'>
                <img className='rounded-full me-2 h-[20px] w-[20px]' src={users?.find((user) => user.id == post.user_id)?.image} alt="user" />
                <span>
                    r/{users?.find((user) => user.id == post.user_id)?.username}
                </span>
                <TbPointFilled className='mx-2 text-[8px] text-gray-600'></TbPointFilled>
                <span className='text-xs text-gray-500'>
                    {timeAgo(post.created_at)}
                </span>
                {
                  post.updated_at && <span className='text-xs text-gray-400 ms-2 flex'>(edited<span className='hidden md:flex'>: {timeAgo(post.updated_at)}</span>)</span>
                }
                {currentUser?.id === post.user_id && (
                    <button
                        className='ms-2 text-lg text-orange-200 hover:text-orange-500'
                        onClick={() => setIsUpdatePostModalOpen(true)} 
                    >
                        <FaEdit />
                    </button>
                )}
            </h5>
            <div>
                <Link legacyBehavior href={`/posts/${post.slug}`}>
                    <h2 className='mb-2 w-full cursor-pointer'>{post.title}</h2>
                </Link>
                <Link legacyBehavior href={`/posts/${post.slug}`}>
                    <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg object-cover max-h-[500px] cursor-pointer" />
                </Link>
                <InteractionBox singlePost={post} />
            </div>
            <UpdatePostModal
                isOpen={isUpdatePostModalOpen}
                onClose={() => setIsUpdatePostModalOpen(false)} // Modal kapat
                post={post} // Güncellenecek post bilgilerini geç
                onUpdate={updatePostByOwner} // Güncelleme fonksiyonu
            />
        </div>
    );
};

export default PostCard;
