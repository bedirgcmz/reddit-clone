

"use client";
import React, { useEffect, useState } from 'react';
import { useFetchContext } from '@/context/FetchContext'; 
import { useGeneralContext } from '@/context/GeneralContext'; 
import Link from 'next/link';
import { TbPointFilled } from 'react-icons/tb'; 
import { AiOutlineEdit } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { confirmAlert, mySwalAlert, timeAgo } from '@/utils/helpers';
import UpdateCommentModal from '@/components/UpdateCommentModal';
import supabase from '@/lib/supabaseClient';
import { CommentWithAuthorDataTypes } from '@/utils/types'; // Adjusted import

const UserComments: React.FC = () => {
  const { comments, getComments,  } = useFetchContext();
  const { currentUser, isUpdateCommentModalOpen, setUpdateCommentModalOpen, updateCommentId, setUpdateCommentId } = useGeneralContext(); 
  const [userComments, setUserComments] = useState<CommentWithAuthorDataTypes[]>([]); // Updated type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = (commentId: string) => {
    setUpdateCommentId(commentId); 
    setUpdateCommentModalOpen(true); 
  };

  const deleteComment = async (commentId: string) => {
    const isConfirmed = await confirmAlert({
      title: "Are you sure?",
      text: "Do you really want to delete this comment?",
    });
    
    if (isConfirmed) {
      try {
        const { error: errorComment } = await supabase
          .from("comments")
          .delete()
          .eq("id", commentId)
          .order('created_at', {ascending: false});

        if (errorComment) throw errorComment;
        
        mySwalAlert({
          icon: "success",
          title: "Successful!",
          text: "This comment was deleted.",
        });
        
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

  useEffect(() => {
    if (!currentUser) return; // currentUser mevcut değilse fonksiyonu çalıştırma
    setLoading(true);
    const getUserComments = async () => {
      try {
        const { data: userCommentsData, error: userCommentsError } = await supabase
          .from("comments")
          .select(`
            *,
            author: users (
              username,
              image
            ),
            post: posts (
              slug,
              title
            )
          `)
          .eq("user_id", currentUser?.id)
          .order('created_at', { ascending: false });

        if (userCommentsError) throw userCommentsError;
        
        setUserComments(userCommentsData as CommentWithAuthorDataTypes[] || []);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getUserComments();
  }, [currentUser, comments]);

  if (!currentUser) return <p>Please log in to see your comments.</p>; 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!userComments || userComments.length === 0) return <p className='text-orange-300'>You haven't commented yet</p>; 

  return (
    <div className='overflow-x-scroll px-2 mb-4'>
      <ul className="comments md:ps-12 pb-8 pt-2 w-full lg:w-[700px]">
        {userComments.map((comment) => (
          <li key={comment.id} className="p-2 md:ps-4 py-4 border-b relative flex flex-col">
            {comment.parent_id && (
              <div className='text-gray-400 text-sm relative mt-2'>
                <p>Replying to this comment: {comments?.find((cm) => cm.id === comment.parent_id)?.content}</p>
                <span className='absolute left-[4px] top-[16px] bg-transparent border-l border-b h-[24px] w-[20px] rounded-bl-lg'></span>
              </div>
            )}
            <div className={`${comment.parent_id ? "pl-6" : ""}`}>
              <span className="absolute top-0 left-0 flex items-center pt-2">
                <img
                  className="rounded-full me-2 h-[20px] w-[20px]"
                  src={comment.author.image}
                  alt="user"
                />
                <span className="text-sm">
                  @{comment.author.username}
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
              <p className="text-sm text-gray-800 mt-2">{comment.content}</p>
              <span className='flex items-center gap-2 mt-1 bg-gray-100 p-2'>
                <span className='text-gray-500'>Related post link:</span>
                <Link
                  href={`/posts/${comment.post.slug}`}
                  className="text-blue-200 hover:text-blue-500 underline" 
                >
                  {comment.post.title}
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

