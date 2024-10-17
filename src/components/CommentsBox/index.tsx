import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import  { timeAgo, mySwalAlert, confirmAlert } from "@/utils/helpers";
import { CommentsDataTypes } from "@/utils/types";
import React from "react";
import { TbPointFilled } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete, MdDeleteForever } from "react-icons/md";
import UpdateCommentModal from "@/components/UpdateCommentModal";
import supabase from "@/lib/supabaseClient";
import ReplyInput from "@/components/ReplyInput";

type CommentsBoxProps = {
  commentsProps: CommentsDataTypes[] | undefined;
  parentCommentId?: string | null;  // Recursive yapıyı desteklemek için parentCommentId eklendi
};

const CommentsBox: React.FC<CommentsBoxProps> = ({ commentsProps, parentCommentId = null }) => {
  const { users, comments, posts, setError, getComments } = useFetchContext();
  const {
    currentUser,
    isUpdateCommentModalOpen,
    setUpdateCommentModalOpen,
    updateCommentId,
    setUpdateCommentId,
  } = useGeneralContext();

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


  const deletePostByOwnPost = async (
    pCommentsId: string
  ) => {
    const postId = comments?.find((cm) => cm.id == pCommentsId)?.post_id;
    const targetUserId = posts?.find((pt) => pt.id == postId)?.user_id;
    const isConfirmed = await confirmAlert({
        title: "Are you sure?",
        text: "Do you really want to delete this comment?",
      });
    
      if (isConfirmed) {
          if (currentUser?.id == targetUserId) {
              console.log("Calisti");
            const { error: deleteError } = await supabase
              .from("comments")
              .delete()
              .eq("id", pCommentsId);
              mySwalAlert({
                  icon: "success",
                  title: "successful!",
                  text: "This comment was deleted.",
                });
      
            if (deleteError) {
              console.error("Error deleting post:", deleteError.message);
              mySwalAlert({
                  icon: "error",
                  title: "Sorry!",
                  text: "This comment was not deleted.",
                });
              return;
            }
          }  
      } 
    getComments();
  };

  return (
    <>
      <ul className={`comments ps-12 pb-2 pt-2 w-full lg:w-[700px] ${parentCommentId ? 'ml-6' : ''}`}>
        {commentsProps
          ?.filter((comment) => comment.parent_id === parentCommentId) 
          ?.map((comment) => (
          <li key={comment.id} className="p-2 ps-4 pt-4 relative flex flex-col">
            <span className="absolute top-0 left-0 flex items-center">
              <img
                className="rounded-full me-2 h-[20px] w-[20px]"
                src={users?.find((e) => e.id == comment.user_id)?.image}
                alt="user"
              />
              <span className="text-sm">
                @{users?.find((e) => e.id == comment.user_id)?.username}
              </span>
              <TbPointFilled className="mx-2 text-[8px] text-gray-600"></TbPointFilled>
              <span className="text-xs text-gray-500  me-2">
                {timeAgo(comment.created_at)}
              </span>
              {currentUser?.id === comment.user_id && (
                <AiOutlineEdit
                  className="mx-2 text-orange-200 cursor-pointer"
                  onClick={() => handleEditClick(comment.id)}
                />
              )}
              {!(currentUser?.id === posts?.find((pt) => pt.id == comments?.find((cm) => cm.id == comment.id)?.post_id)?.user_id) && currentUser?.id === comment.user_id && (
                <MdDeleteForever
                  className="me-2 text-orange-200 cursor-pointer"
                  onClick={() => deleteComment(comment.id)}
                />
              )}
                {currentUser?.id === posts?.find((pt) => pt.id == comments?.find((cm) => cm.id == comment.id)?.post_id)?.user_id && (
                <MdDelete
                  className="me-2 text-orange-200 cursor-pointer"
                  onClick={() => deletePostByOwnPost(comment.id)}
                />
              )}
            </span>
            <p className="text-sm text-gray-800">{comment.content}</p>

             {/* ReplyInput bileşenini her yorumun altına ekle */}
             <ReplyInput parentCommentId={comment.id} postId={comment.post_id} />
            {/* Alt yorumları render etmek için recursive çağrı */}
            <CommentsBox commentsProps={commentsProps} parentCommentId={comment.id} />
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

export default CommentsBox;

