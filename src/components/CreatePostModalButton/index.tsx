import { useState } from "react";
import CreatePostModal from "@/components/CreatePostModal";

export default function CreatePostModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(true)}>
        Create Post
      </button>
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
