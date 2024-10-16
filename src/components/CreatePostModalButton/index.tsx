"use client"
import { useState } from "react";
import CreatePostModal from "@/components/CreatePostModal";
import { IoMdAdd } from "react-icons/io";

type ButtonProps = {
  specialStyles: string
}

 const CreatePostModalButton:React.FC<ButtonProps> = ({specialStyles}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <button className="w-full px-2 py-1 bg-blue-500 text-2xl flex items-center justify-center text-white rounded" onClick={() => setIsModalOpen(true)}>
         <span className={`text-sm me-2 ${specialStyles}`}>Create</span> <IoMdAdd />
      </button>
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default CreatePostModalButton