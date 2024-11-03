import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import  { timeAgo, mySwalAlert, confirmAlert } from "@/utils/helpers";
import { CommentWithAuthorDataTypes } from "@/utils/types";
import React from "react";
import { TbPointFilled } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete, MdDeleteForever } from "react-icons/md";
import UpdateCommentModal from "@/components/UpdateCommentModal";
import supabase from "@/lib/supabaseClient";
import ReplyInput from "@/components/ReplyInput";

// type CommentsBoxProps = {
//   commentsProps: CommentsDataTypes[] | undefined;
//   parentCommentId?: string | null;  // Recursive yapıyı desteklemek için parentCommentId eklendi
// };

type CommentsBoxProps = {
  commentsProps: CommentWithAuthorDataTypes[] | undefined;
  parentCommentId?: string | null;
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
      <ul className={`comments sm:ps-1 md:ps-2 pb-0 pt-2 w-full  scr ${parentCommentId ? 'ml-1 sm:ml-2 md:ml-4' : ''}`}>
        {commentsProps
          ?.filter((comment) => comment.parent_id === parentCommentId) 
          ?.map((comment) => (
          <li key={comment.id} className="p-2 md:ps-4 pt-4 relative flex flex-col max-w-[600px]">
            <span className="absolute top-0 left-0 flex items-start sm:items-center  flex-col sm:flex-row">
              <span className="flex items-center">
                  <img
                    className="rounded-full me-2 h-[20px] w-[20px]"
                    src={comment.author.image}
                    alt="user"
                  />
                  <span className="text-sm">
                    @{comment.author.username}
                  </span>
              </span>
              <span className="flex items-center">
                  <TbPointFilled className="mx-2 text-[8px] text-gray-600"></TbPointFilled>
                  <span className="text-xs text-gray-500  me-2">
                    {timeAgo(comment.created_at)}
                  </span>
                  {
                      comment.updated_at && <span className='text-xs text-gray-400 mx-2 flex'>(edited<span className='hidden lg:flex'>: {timeAgo(comment.updated_at)}</span>)</span>
                    }
                  {currentUser?.id === comment.user_id && (
                    <AiOutlineEdit
                      className="mx-2 text-orange-200 cursor-pointer"
                      onClick={() => handleEditClick(comment.id)}
                    />
                  )}
                  {!(currentUser?.id === posts?.find((pt) => pt.id == comments?.find((cm) => cm.id == comment.id)?.post_id)?.user_id) && currentUser?.id === comment.user_id && (
                    <MdDeleteForever
                      className="me-2 text-orange-200 cursor-pointer aa"
                      onClick={() => deleteComment(comment.id)}
                    />
                  )}
                    {currentUser?.id === posts?.find((pt) => pt.id == comments?.find((cm) => cm.id == comment.id)?.post_id)?.user_id && (
                    <MdDeleteForever
                      className="me-2 text-orange-200 cursor-pointer"
                      onClick={() => deletePostByOwnPost(comment.id)}
                    />
                  )}
              </span>
            </span>
            <p className="text-sm text-gray-800 mt-[10px] sm:mt-0 max-w-[550px]">{comment.content}</p>

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

