

import { useState } from 'react';
import { IoMdText, IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import supabase from '@/lib/supabaseClient';
import { CommentWithAuthorDataTypes, PostDataTypes } from '@/utils/types';

type InteractionBoxProps = {
    singlePost: PostDataTypes;
  };

const CreateCommentInput: React.FC<InteractionBoxProps> = ({ singlePost }) => {
  const { currentUser } = useGeneralContext();
  const { setComments, getComments } = useFetchContext();
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCommit = async () => {
    if (!comment.trim()) return;

    // Insert the comment into the 'comments' table
    const { error } = await supabase.from('comments').insert([
      {
        content: comment,
        user_id: currentUser?.id,
        post_id: singlePost.id,
      },
    ]);

    if (error) {
      console.error('Comment error:', error.message);
      return;
    }

    // Fetch comments with user data (username and image)
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select(`
      id, content, user_id, post_id, parent_id, created_at, updated_at,
        users: user_id (username, image)
      `)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Comments fetch error:', commentsError.message);
      return;
    }

    if (commentsData) {
      // Format comments to include author data
      const formattedComments = commentsData.map((comment) => ({
        ...comment,
        author: comment.users,
      }));

      setComments(formattedComments as unknown as CommentWithAuthorDataTypes[]);
    }

    // Clear the input and reset focus
    setComment('');
    setIsFocused(false);
   

  };

  return (
    <div className="w-full lg:w-[700px] px-4 py-2 mb-2">
      <textarea
        placeholder="Leave a comment..."
        className="w-full p-2 border border-gray-300 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && (
        <div className="flex justify-between items-center mt-2 py-2 rounded ">
          <div className="flex items-center justify-end w-full">
            <button
              onClick={() => {
                setComment('');
                setIsFocused(false);
              }}
              className="mr-2 text-gray-600 flex items-center bg-orange-400 text-white px-2 py-1 rounded gap-1"
            >
              <IoMdClose />
              Cancel
            </button>
            <button onClick={handleCommit} 
            className="text-gray-600 bg-blue-400 flex items-center text-white px-2 py-1 rounded gap-1">
              <IoMdCheckmark />
              Commit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCommentInput;
