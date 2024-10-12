import React from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient"; 

const LogoutButton: React.FC = () => {
  const { setCurrentUser } = useGeneralContext(); 

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); 

    if (error) {
      console.error("Logout error:", error);
    } else {
      setCurrentUser(null); 
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-500 hover:bg-gray-700 text-white hover:text-orange  text-[12px] md:text-sm py-[10px] px-[20px] me-2 md:me-0 md:py-2 md:px-4 rounded-full"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
