import React, { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import { FaComment } from "react-icons/fa";
import { showLoginModalIfNotAuthenticated } from "@/utils/helpers";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

type ReplyInputProps = {
  parentCommentId: string;
  postId: string;
};

const ReplyInput: React.FC<ReplyInputProps> = ({ parentCommentId, postId }) => {
  const [replyText, setReplyText] = useState("");
  const [isReplyOpen, setReplyOpen] = useState(false);
  const { currentUser, isSigninModalOpen, setIsSigninModalOpen} = useGeneralContext();

  const { getComments } = useFetchContext();

  const handleReplyClick = () => {
    if (currentUser) {
      setReplyOpen(!isReplyOpen);
    } else {
      showLoginModalIfNotAuthenticated(currentUser !== null, () => {
        setIsSigninModalOpen(true); 
      });
    }
  };

  const handleCommit = async () => {
    if (!replyText.trim()) {
      setReplyOpen(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            content: replyText,
            user_id: currentUser?.id,
            post_id: postId,
            parent_id: parentCommentId, 
          },
        ]);

      if (error) throw error;

      setReplyText(""); 
      setReplyOpen(false); 
      getComments(); 
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  return (
    <div className="">
      <button
        className="text-xs text-gray-500 px-1 py-1 hover:bg-gray-200 rounded-lg flex items-center"
        onClick={handleReplyClick}
      >
        <FaComment className="me-1"/>
        Reply
      </button>

      {isReplyOpen && (
        <div className="mt-2 flex flex-col space-y-2">
          <textarea
            className="p-2 w-full h-20 border border-gray-300 rounded"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
          />
          <div className="flex justify-end space-x-1">
            <button
              className="mr-2 text-gray-600 flex items-center bg-orange-400 h-[27px] text-xs text-white px-2 py-0 rounded gap-1 "
              onClick={() => setReplyOpen(false)}
            >
              <IoMdClose />
              Cancel
            </button>
            <button
              className="text-gray-600 bg-blue-400 flex items-center text-xs text-white px-2 py-0 rounded gap-1"
              onClick={handleCommit}
            >
              <IoMdCheckmark />
              Commit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyInput;
