"use client"

import React, { useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const UserAccount = () => {
  const { currentUser, setCurrentUser } = useGeneralContext();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [editField, setEditField] = useState<string | null>(null);

  // Kullanıcı verilerini yükle
  useEffect(() => {
    if (currentUser) {
      setFullname(currentUser.fullname);
      setUsername(currentUser.username);
      setImage(currentUser.image);
    }
  }, [currentUser]);

  // Güncelleme fonksiyonu
  const updateField = async (field: string, value: string) => {
    const updates: any = { [field]: value };
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", currentUser?.id)
      .select();

    if (error) {
      console.error("Update error:", error.message);
    } else if (data) {
      setCurrentUser(data[0]); // Güncellenen veriyi Context’e yansıt
      setEditField(null);
    }
  };

  // Alan sıfırlama
  const resetField = (field: string) => {
    if (field === "fullname") setFullname(currentUser?.fullname || "");
    if (field === "username") setUsername(currentUser?.username || "");
    setEditField(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-[600px] mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">User Account</h1>

      {/* Profil Resmi */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={image || "/default-avatar.png"} // Varsayılan resim
          alt="Profile"
          className="w-24 h-24 rounded-full mb-3 object-cover border"
        />
        <label className="text-blue-600 cursor-pointer text-sm">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImage(URL.createObjectURL(file));
              setEditField("image");
            }}
          />
          Change Image
        </label>
        {editField === "image" && (
          <div className="flex mt-2 space-x-2">
            <FaCheck
              className="text-green-500 cursor-pointer"
              onClick={() => {
                // Görsel URL'i alın ve güncelleyin
                updateField("image", image);
              }}
            />
            <FaTimes
              className="text-red-500 cursor-pointer"
              onClick={() => resetField("image")}
            />
          </div>
        )}
      </div>

      {/* Full Name */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700">Name:</span>
        <div className="flex items-center w-2/3">
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="border border-gray-300 rounded p-1 w-full"
            disabled={editField !== "fullname"}
            // placeholder={currentUser?.fullname}

          />
          {editField === "fullname" ? (
            <div className="flex items-center ml-2">
              <FaCheck
                className="text-green-500 cursor-pointer"
                onClick={() => updateField("fullname", fullname)}
              />
              <FaTimes
                className="text-red-500 cursor-pointer ml-2"
                onClick={() => resetField("fullname")}
              />
            </div>
          ) : (
            <FaEdit
              className="text-blue-500 cursor-pointer ml-2"
              onClick={() => setEditField("fullname")}
            />
          )}
        </div>
      </div>

      {/* Username */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-700">Username:</span>
        <div className="flex items-center w-2/3">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded p-1 w-full"
            disabled={editField !== "username"}
            // placeholder={currentUser?.username}

          />
          {editField === "username" ? (
            <div className="flex items-center ml-2">
              <FaCheck
                className="text-green-500 cursor-pointer"
                onClick={() => updateField("username", username)}
              />
              <FaTimes
                className="text-red-500 cursor-pointer ml-2"
                onClick={() => resetField("username")}
              />
            </div>
          ) : (
            <FaEdit
              className="text-blue-500 cursor-pointer ml-2"
              onClick={() => setEditField("username")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
