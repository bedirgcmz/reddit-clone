import React, { useState } from 'react';
import { PostDataTypes } from '@/utils/types'; 

type UpdatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: PostDataTypes; 
  onUpdate: (postId: string, updatedPost: { title: string; content: string; image: File | null }) => void; 
};

const UpdatePostModal: React.FC<UpdatePostModalProps> = ({ isOpen, onClose, post, onUpdate }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null); 

  const handleUpdate = () => {
    // Post Card componentinden geliyor
    onUpdate(post.id, { title, content, image });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Update Post</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 mt-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full border p-2 mt-2"
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)} 
          className="mt-2"
        />
        <button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white p-2 rounded mr-2">
          Update
        </button>
        <button onClick={onClose} className="mt-2 bg-gray-500 text-white p-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdatePostModal;
