import { useState } from 'react';
import { IoMdText, IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import supabase from '@/lib/supabaseClient';
import { PostDataTypes } from '@/utils/types';

type InteractionBoxProps = {
    singlePost: PostDataTypes;
  };

const CreateCommentInput:React.FC<InteractionBoxProps> = ({ singlePost }) => {
  const { currentUser } = useGeneralContext();
  const { setComments } = useFetchContext();
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleCommit = async () => {
    if (!comment.trim()) return;

    const { error } = await supabase.from('comments').insert([
      {
        content: comment,
        user_id: currentUser?.id,
        post_id: singlePost.id,
      },
    ]);

     // Tum Comments verilerini alalim
     const { data: commentsData, error: commentsError } = await supabase
     .from('comments')
     .select('*') 
     .order('created_at', {ascending: false})
     
     if (commentsError) throw commentsError;
     if (!commentsData) throw new Error(`No comment found`);
     setComments(commentsData); 

    if (error) {
      console.error('Comment error:', error.message);
    } else {
      setComment('');
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full lg:w-[700px] px-4 py-2 mb-2">
      <input
        type="text"
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
