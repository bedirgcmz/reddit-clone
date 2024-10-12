// src/components/CreatePostModal.tsx
"use client";
import { useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { currentUser } = useGeneralContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !currentUser) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      // Resmi yükle ve URL al
      let imageUrl = null;
      if (image) {
        const { data, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(`public/${image.name}`, image);

        if (uploadError) throw uploadError;
        imageUrl = data?.path ? supabase.storage.from("post-images").getPublicUrl(data.path).data?.publicUrl : null;
      }

      // Post verisini oluştur
      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([
          {
            title,
            content,
            image: imageUrl,
            user_id: currentUser.id,
            slug: title.toLowerCase().replace(/\s+/g, "-"),
            created_at: new Date(),
          },
        ]);

      if (postError) throw postError;
      onClose(); // Modal'ı kapat

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
