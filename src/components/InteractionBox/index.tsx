import {  FaRegHeart, FaComment, FaHeart, FaShare } from "react-icons/fa";
import { TbArrowBigUp, TbArrowBigDown } from "react-icons/tb";
import { useState } from "react";
import { PostDataTypes } from "@/utils/types";
import { useFetchContext } from "@/context/FetchContext";
import Link from "next/link";


type InteractionBoxProps = {
  singlePost: PostDataTypes;
};

const InteractionBox: React.FC<InteractionBoxProps>  = ({singlePost}) => {
  const [count, setCount] = useState(0); 
  const {
    setPostParamsSlug,
    comments, 
    setComments,
    users, 
    setUsers,
    loading,
    error,
  } = useFetchContext();

  return (
    <div className=" text-gray-600 py-4 flex justify-start items-center space-x-4">
      
      {/* Beğenme ve Beğenmeme Alanı */}
      <div className="flex items-center space-x-2 bg-gray-200 rounded-full px-[12px] py-2 h-[40px]">
        <TbArrowBigUp
          className="cursor-pointer text-xl"
          onClick={() => setCount(count + 1)} 
        />
        <span>{count}</span>
        <TbArrowBigDown
          className="cursor-pointer text-xl"
          onClick={() => setCount(count - 1)} 
        />
      </div>
      
      {/* Yorum Yapma Alanı */}
      <div className="flex cursor-pointer items-center space-x-2 bg-gray-200 rounded-full px-[12px] py-2 h-[40px]">
        <Link href={`/posts/${singlePost.slug}`} passHref className="flex items-center justfy-center gap-1">
          <FaComment />
          <span>
            {
            comments?.filter((cm) => cm.post_id == singlePost.id)?.length
            }
            </span>
        </Link>
      </div>

      {/* Favorilere Ekle */}
      <div className="flex items-center space-x-2 bg-gray-200 rounded-full px-[12px] py-2 h-[40px]">
        {/* <FaHeart className="cursor-pointer text-orange" /> */}
        <FaRegHeart className="cursor-pointer" />
      </div>

      {/* Paylaş */}
      <div className="flex cursor-pointer items-center space-x-2 bg-gray-200 rounded-full px-[12px] py-2 h-[40px]">
        <FaShare />
        <span>Share</span>
      </div>

    </div>
  );
};

export default InteractionBox;
