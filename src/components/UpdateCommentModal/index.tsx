import React, { useState, useEffect } from 'react';
import { useFetchContext } from '@/context/FetchContext';
import { useGeneralContext } from '@/context/GeneralContext';
import { AiFillCloseCircle } from 'react-icons/ai';
import supabase from '@/lib/supabaseClient';

type UpdateCommentModalProps = {
  commentId: string;
};

const UpdateCommentModal: React.FC<UpdateCommentModalProps> = ({ commentId }) => {
  const { comments, setComments, getComments } = useFetchContext();
  const { setUpdateCommentModalOpen, isUpdateCommentModalOpen } = useGeneralContext();
  const [commentContent, setCommentContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Yorumun content alanını al
    const currentComment = comments?.find((comment) => comment.id === commentId);
    if (currentComment) {
      setCommentContent(currentComment.content);
    }
  }, [commentId, comments]);

  const handleUpdateComment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: commentContent, updated_at: new Date() })
        .eq('id', commentId);
        
      if (error) throw error;

     // Yorumları tekrar çek
     getComments();

      setUpdateCommentModalOpen(false); 
    } catch (err) {
      console.error('Error updating comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    isUpdateCommentModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Update Comment</h2>
            <AiFillCloseCircle
              className="text-red-500 cursor-pointer"
              size={24}
              onClick={() => setUpdateCommentModalOpen(false)}
            />
          </div>
          <textarea
            className="w-full p-2 mt-4 border rounded"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdateComment}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateCommentModal;
