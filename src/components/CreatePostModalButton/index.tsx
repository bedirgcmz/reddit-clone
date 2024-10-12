"use client"
import { useState } from "react";
import CreatePostModal from "@/components/CreatePostModal";
import { IoMdAdd } from "react-icons/io";


export default function CreatePostModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <button className="w-full px-2 py-1 bg-blue-500 text-2xl flex items-center justify-center text-white rounded" onClick={() => setIsModalOpen(true)}>
         <span className="text-sm me-2">Add New Post</span> <IoMdAdd />
      </button>
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
