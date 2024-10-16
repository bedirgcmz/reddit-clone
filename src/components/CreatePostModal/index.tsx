

"use client";
import { useState, useEffect } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient";
import { useFetchContext } from "@/context/FetchContext";
import { v4 as uuidv4 } from 'uuid';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { currentUser } = useGeneralContext();
  const { getPosts, subtopics } = useFetchContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null); // New state for selected subtopic
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  // currentUser'ın değişimini izleyin
  useEffect(() => {
    
  }, [currentUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !currentUser || !selectedSubtopicId) {
      setError("Please fill in all fields and make sure you are logged in.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // public URL'yi al
        imageUrl = supabase.storage.from("post-images").getPublicUrl(fileName).data.publicUrl;
      }

      // Post id'sini al
      const newId = uuidv4();

      // Post verisini oluştur
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            id: newId,
            title,
            content,
            image: imageUrl,
            user_id: currentUser?.id,
            slug: title.toLowerCase().replace(/\s+/g, "-"),
            created_at: new Date(),
          },
        ]);

        

      // Subtopic için post_subtopics tablosuna ekleme yap
      const { error: subtopicError } = await supabase
        .from("post_subtopics")
        .insert([
          {
            post_id: newId,
            subtopic_id: selectedSubtopicId,
          },
        ]);

      if (subtopicError) throw subtopicError;

      getPosts();
      onClose();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl mb-4">Create a Post</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <select
            value={selectedSubtopicId || ""}
            onChange={(e) => setSelectedSubtopicId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a subtopic</option>
            {subtopics?.map((subtopic) => (
              <option key={subtopic.id} value={subtopic.id}>
                {subtopic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input type="file" onChange={handleImageChange} />
        </div>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
