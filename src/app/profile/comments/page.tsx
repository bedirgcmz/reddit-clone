"use client"
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import { useGeneralContext } from '@/context/GeneralContext'; 
import Link from 'next/link';
import { TbPointFilled } from 'react-icons/tb'; 
import { AiOutlineEdit } from 'react-icons/ai';
import { MdDeleteForever, MdDelete } from 'react-icons/md';
import { confirmAlert, mySwalAlert, timeAgo } from '@/utils/helpers';
import UpdateCommentModal from '@/components/UpdateCommentModal';
import supabase from '@/lib/supabaseClient';
import { CommentsDataTypes } from '@/utils/types';
import CommentsBox from '@/components/CommentsBox';

const UserComments: React.FC = () => {
  const { comments, posts, users, getComments, setError, setLoading, loading, error } = useFetchContext();
  const { currentUser,  isUpdateCommentModalOpen,
    setUpdateCommentModalOpen,
    updateCommentId,
    setUpdateCommentId, } = useGeneralContext(); 
    const [userComments, setUserComments] = useState<CommentsDataTypes[] | undefined>([])

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

    // const filteredComments = comments?.filter((cm) => cm.user_id == currentUser?.id)

    useEffect( () => {
      setLoading(true)
    const getUserComments = async () => {
      try {
          const { data: userCommentsData, error: userCommentsDta } = await supabase
          .from("comments")
          .select()
          .eq("user_id", currentUser?.id)
          .order('created_at', {ascending: false})

          setUserComments(userCommentsData || [])
      } catch (error) {
          console.log(error);
      } finally {
        setLoading(false)
      }
    }
    getUserComments()
  }, [currentUser, comments]);
  console.log(userComments);
   

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!currentUser) return <p>Please log in to see your posts.</p>; 

  return (
    <div className='overflow-x-scroll pl-2'>
      <ul className="comments ps-12 pb-8 pt-2 w-full lg:w-[700px]">
        {userComments?.map((comment) => (
          <li key={comment.id} className="p-2 ps-4 py-4 border-b relative flex flex-col ">
              {
                comment.parent_id && 
            <div className='text-gray-400 text-sm'>
              <p>@{(users?.find((user) => user.id == comments?.find((cm) => cm.id == comment.parent_id)?.user_id))?.username}</p>
              <p>{comments?.find((cm) => cm.id == comment.parent_id)?.content}</p>
            </div>
              }
              <div className={` ${comment.parent_id && "pl-6"}`}>
                <span className="absolutew top-0 left-0 flex items-center pt-2">
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
                <span className='flex items-center gap-2  mt-1 bg-gray-100 p-2'>
                  <span className='text-gray-500'>Related post link:</span>
                  <Link
                    href={`/posts/${posts?.find((post) => post.id === comment.post_id)?.slug}`}
                    className="text-blue-200 hover:text-blue-500 underline" 
                  >
                    {/* Yorumun ait olduğu postun adı */}
                    {posts?.find((post) => post.id === comment.post_id)?.title}
                  </Link>
                </span>

              </div>
          </li>
        ))}
      </ul>

      {/* Modal component */}
      {isUpdateCommentModalOpen && updateCommentId && (
        <UpdateCommentModal commentId={updateCommentId} />
      )}
    </div>
  );
};

export default UserComments;
