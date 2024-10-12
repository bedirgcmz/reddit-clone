import React from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient"; // Supabase'i import et

const LogoutButton: React.FC = () => {
  const { setCurrentUser } = useGeneralContext(); // currentUser state'ini güncellemek için

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Supabase ile çıkış yap

    if (error) {
      console.error("Logout error:", error);
    } else {
      setCurrentUser(null); // Kullanıcıyı sıfırla
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
