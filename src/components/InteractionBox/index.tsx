import {  FaRegHeart, FaComment, FaHeart, FaShare } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import { MdDeleteForever } from "react-icons/md";
import {  useState } from "react";
import { PostDataTypes } from "@/utils/types";
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";
import  { mySwalAlert, confirmAlert, showLoginModalIfNotAuthenticated } from "@/utils/helpers";
import FavoriteButton from "../FavoriteButton";



type InteractionBoxProps = {
  singlePost: PostDataTypes;
};

const InteractionBox: React.FC<InteractionBoxProps>  = ({singlePost}) => {
  const [count, setCount] = useState(0); 
  const {comments, getPosts,} = useFetchContext();
  const {currentUser, setIsSigninModalOpen } = useGeneralContext();

  type DeleteFuncProps = {
    pPostId: string
  }
// Asenkron bir fonksiyon olarak deletePost'u tanımlayalim
const deletePost = async ({ pPostId }: DeleteFuncProps) => {
  const isConfirmed = await confirmAlert({
    title: "Are you sure?",
    text: "Do you really want to delete this post?",
  });

  if (isConfirmed) {
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", pPostId);
    
      mySwalAlert({
        icon: "success",
        title: "successful!",
        text: "This post was deleted.",
      });
    if (deleteError) {
      mySwalAlert({
        icon: "error",
        title: "Sorry!",
        text: "This post was not deleted.",
      });
      console.error("Error deleting post:", deleteError.message);
      return;
    }
  }
  getPosts(); 
};


const handleComment = () => {
  if (!currentUser) {
    showLoginModalIfNotAuthenticated(currentUser !== null, () => {
      setIsSigninModalOpen(true); 
  } );
  }
}

  return (
    <div className=" text-gray-600 py-4 flex justify-between sm:justify-start items-center space-x-4">
      
      {/* Beğenme ve Beğenmeme Alanı */}
      <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-200 rounded-full px-[6px] sm:px-[12px] py-1 sm:py-2 h-[34px] sm:h-[40px] text-sm sm:text-xl">
        <TbArrowBigUp
          className="cursor-pointer "
          onClick={() => setCount(count + 1)} 
        />
        <span>{count}</span>
        <TbArrowBigDown
          className="cursor-pointer t"
          onClick={() => setCount(count - 1)} 
        />
      </div>
      
      {/* Yorum Yapma Alanı */}
      <div className="flex cursor-pointer relative items-center space-x-2 bg-gray-200 rounded-full px-[6px] sm:px-[12px] py-1 sm:py-2 h-[34px] sm:h-[40px] text-sm sm:text-xl">
          <span onClick={() => {handleComment()}} className="flex items-center justfy-center gap-1">
            <FaComment />
            <span>
              {
                comments?.filter((cm) => cm.post_id == singlePost.id)?.length
              }
              </span>
              {currentUser  && (
            <Link href={`/posts/${singlePost.slug}`} passHref className="flex w-full h-full absolute top-0 left-0 items-center justify-center gap-1" />
    )}
          </span>
      </div>

      {/* Favorilere Ekle */}
      <div className="flex items-center space-x-2 bg-gray-200 rounded-full px-[6px] sm:px-[12px] py-1 sm:py-2 h-[34px] sm:h-[40px] text-sm sm:text-xl">
        <FavoriteButton singlePostId={singlePost.id} currentUserId={currentUser?.id}/>
      </div>

      {/* Paylaş */}
      <div className="flex cursor-pointer items-center space-x-1 sm:space-x-2 bg-gray-200 rounded-full px-[6px] sm:px-[12px] py-1 sm:py-2 h-[34px] sm:h-[40px] text-sm sm:text-xl">
        <FaShare />
        <span>Share</span>
      </div>
      {/* Sil */}
      {
        currentUser?.id == singlePost.user_id && (
          <button onClick={() => deletePost({ pPostId: singlePost.id })} className="flex cursor-pointer items-center space-x-1 sm:space-x-2 bg-gray-200 rounded-full px-[6px] sm:px-[12px] py-1 sm:py-2 h-[34px] sm:h-[40px] text-sm sm:text-xl">
            <MdDeleteForever className="text-xl"/>
            <span>Delete</span>
          </button>
        )
      }

    </div>
  );
};

export default InteractionBox;
