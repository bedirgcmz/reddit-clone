"use client"
import React from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import { useGeneralContext } from '@/context/GeneralContext'; 
import Link from 'next/link';
import { TbPointFilled } from 'react-icons/tb'; 
import { AiOutlineEdit } from 'react-icons/ai';
import { MdDeleteForever, MdDelete } from 'react-icons/md';
import { confirmAlert, mySwalAlert, timeAgo } from '@/utils/helpers';
import UpdateCommentModal from '@/components/UpdateCommentModal';
import supabase from '@/lib/supabaseClient';

const UserComments: React.FC = () => {
  const { comments, posts, users, getComments, setError } = useFetchContext();
  const { currentUser,  isUpdateCommentModalOpen,
    setUpdateCommentModalOpen,
    updateCommentId,
    setUpdateCommentId, } = useGeneralContext(); 

    const handleEditClick = (commentId: string) => {
      setUpdateCommentId(commentId); 
      setUpdateCommentModalOpen(true); 
    };
  
    const deleteComment = async (pCommentId: string) => {
      const isConfirmed = await confirmAlert({
          title: "Are you sure?",
          text: "Do you really want to delete this comment?",
        });
      
        if (isConfirmed) {
            try {
              const { error: errorComment } = await supabase
                .from("comments")
                .delete()
                .eq("id", pCommentId);
                mySwalAlert({
                  icon: "success",
                  title: "successful!",
                  text: "This comment was deleted.",
                });
                if (errorComment) throw errorComment;
                getComments();
              } catch (err) {
                mySwalAlert({
                  icon: "error",
                  title: "Sorry!",
                  text: "This comment was not deleted.",
                });
              setError((err as Error).message);
            }
  
        }
    };

    const filteredComments = comments?.filter((cm) => cm.user_id == currentUser?.id)
  return (
    <>
      <ul className="comments ps-12 pb-8 pt-2 w-full lg:w-[700px]">
        {filteredComments?.map((comment) => (
          <li key={comment.id} className="p-2 ps-4 py-4 border-b relative flex flex-col ">
            <span className="absolute top-0 left-0 flex items-center pt-2">
              <img
                className="rounded-full me-2 h-[20px] w-[20px]"
                src={users?.find((e) => e.id == comment.user_id)?.image}
                alt="user"
              />
              <span className="text-sm">
                @{users?.find((e) => e.id == comment.user_id)?.username}
              </span>
              <TbPointFilled className="mx-2 text-[8px] text-gray-600" />
              <span className="text-xs text-gray-500 me-2">
                {/* Yorumun oluşturulma tarihini gösteren bir fonksiyon */}
                {timeAgo(comment.created_at)}
              </span>
              {currentUser?.id === comment.user_id && (
                <AiOutlineEdit
                  className="mx-2 text-orange-200 cursor-pointer"
                  onClick={() => handleEditClick(comment.id)}
                />
              )}
                <MdDeleteForever
                  className="me-2 text-orange-200 cursor-pointer"
                  onClick={() => deleteComment(comment.id)}
                />
            </span>
            <p className="text-sm text-gray-800">{comment.content}</p>
            <Link
              href={`/posts/${posts?.find((post) => post.id === comment.post_id)?.slug}`}
              className="text-blue-200 mt-1 hover:text-blue-500 underline" 
            >
              {/* Yorumun ait olduğu postun adı */}
              {posts?.find((post) => post.id === comment.post_id)?.title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Modal component */}
      {isUpdateCommentModalOpen && updateCommentId && (
        <UpdateCommentModal commentId={updateCommentId} />
      )}
    </>
  );
};

export default UserComments;
