// "use client"

// import React, { useEffect, useState } from "react";
// import { useGeneralContext } from "@/context/GeneralContext";
// import supabase from "@/lib/supabaseClient";
// import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
// import { useFetchContext } from "@/context/FetchContext";

// const UserAccount = () => {
//   const { currentUser, setCurrentUser } = useGeneralContext();
//   const { loading, error } = useFetchContext();
//   const [fullname, setFullname] = useState("");
//   const [username, setUsername] = useState("");
//   const [image, setImage] = useState("");
//   const [editField, setEditField] = useState<string | null>(null);

//   // Kullanıcı verilerini yükle
//   useEffect(() => {
//     if (currentUser) {
//       setFullname(currentUser.fullname);
//       setUsername(currentUser.username);
//       setImage(currentUser.image);
//     }
//   }, [currentUser]);

//   // Güncelleme fonksiyonu
//   const updateField = async (field: string, value: string) => {
//     const updates: any = { [field]: value };
//     const { data, error } = await supabase
//       .from("users")
//       .update(updates)
//       .eq("id", currentUser?.id)
//       .select();

//     if (error) {
//       console.error("Update error:", error.message);
//     } else if (data) {
//       setCurrentUser(data[0]); 
//       setEditField(null);
//     }
//   };

//   // Alan sıfırlama
//   const resetField = (field: string) => {
//     if (field === "fullname") setFullname(currentUser?.fullname || "");
//     if (field === "username") setUsername(currentUser?.username || "");
//     setEditField(null);
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!currentUser) return <p>Please log in to see your account.</p>; 

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md max-w-[600px] mx-auto mt-8">
//       <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">User Account</h1>

//       {/* Profil Resmi */}
//       <div className="flex flex-col items-center mb-6">
//         <img
//           src={image || "/default-avatar.png"} // Varsayılan resim
//           alt="Profile"
//           className="w-24 h-24 rounded-full mb-3 object-cover border"
//         />
//         <label className="text-blue-600 cursor-pointer text-sm">
//           <input
//             type="file"
//             className="hidden"
//             onChange={(e) => {
//               const file = e.target.files?.[0];
//               if (file) setImage(URL.createObjectURL(file));
//               setEditField("image");
//             }}
//           />
//           Change Image
//         </label>
//         {editField === "image" && (
//           <div className="flex mt-2 space-x-2">
//             <FaCheck
//               className="text-green-500 cursor-pointer"
//               onClick={() => {
//                 // Görsel URL'i alın ve güncelleyin
//                 updateField("image", image);
//               }}
//             />
//             <FaTimes
//               className="text-red-500 cursor-pointer"
//               onClick={() => resetField("image")}
//             />
//           </div>
//         )}
//       </div>

//       {/* Full Name */}
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-gray-700">Name:</span>
//         <div className="flex items-center w-2/3">
//           <input
//             type="text"
//             value={fullname}
//             onChange={(e) => setFullname(e.target.value)}
//             className="border border-gray-300 rounded p-1 w-full"
//             disabled={editField !== "fullname"}
//             // placeholder={currentUser?.fullname}

//           />
//           {editField === "fullname" ? (
//             <div className="flex items-center ml-2">
//               <FaCheck
//                 className="text-green-500 cursor-pointer"
//                 onClick={() => updateField("fullname", fullname)}
//               />
//               <FaTimes
//                 className="text-red-500 cursor-pointer ml-2"
//                 onClick={() => resetField("fullname")}
//               />
//             </div>
//           ) : (
//             <FaEdit
//               className="text-blue-500 cursor-pointer ml-2"
//               onClick={() => setEditField("fullname")}
//             />
//           )}
//         </div>
//       </div>

//       {/* Username */}
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-gray-700">Username:</span>
//         <div className="flex items-center w-2/3">
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="border border-gray-300 rounded p-1 w-full"
//             disabled={editField !== "username"}
//             // placeholder={currentUser?.username}

//           />
//           {editField === "username" ? (
//             <div className="flex items-center ml-2">
//               <FaCheck
//                 className="text-green-500 cursor-pointer"
//                 onClick={() => updateField("username", username)}
//               />
//               <FaTimes
//                 className="text-red-500 cursor-pointer ml-2"
//                 onClick={() => resetField("username")}
//               />
//             </div>
//           ) : (
//             <FaEdit
//               className="text-blue-500 cursor-pointer ml-2"
//               onClick={() => setEditField("username")}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserAccount;

"use client";

import React, { useEffect, useState } from "react";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { useFetchContext } from "@/context/FetchContext";
import { setLocalStorage } from "@/utils/helpers";

const UserAccount = () => {
  const { currentUser, setCurrentUser } = useGeneralContext();
  const { loading, error, setError } = useFetchContext();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editField, setEditField] = useState<string | null>(null);

  if (!currentUser) return <p>Please log in to see your account.</p>;


  // Kullanıcı verilerini yükle
  useEffect(() => {
    if (currentUser) {
      setFullname(currentUser.fullname);
      setUsername(currentUser.username);
      setImage(currentUser.image);
    }
  }, [currentUser]);

  // Alan güncelleme fonksiyonu
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
      setCurrentUser(data[0]);
      setLocalStorage("userRedditClone", data[0]);
      setEditField(null);
    }
  };

  // Resmi Supabase Storage’a yükleme
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from("users-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("users-images")
      .getPublicUrl(fileName);

    return publicData?.publicUrl || null;
  };

  // Yeni resmi güncelle
  const updateImageField = async () => {
    if (newImageFile) {
      const imageUrl = await uploadImage(newImageFile);
      if (imageUrl) {
        updateField("image", imageUrl);
      }
    }
  };

  // Alan sıfırlama fonksiyonu
  const resetField = (field: string) => {
    if (field === "fullname") setFullname(currentUser?.fullname || "");
    if (field === "username") setUsername(currentUser?.username || "");
    if (field === "image") setImage(currentUser?.image || "");
    setEditField(null);
  };

  useEffect(() => {
    if(currentUser) setError(null)
  },[])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-[600px] mx-auto mt-8 mb-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">User Account</h1>

      {/* Profil Resmi */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={image || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full mb-3 object-cover border"
        />
        <label className="text-blue-600 cursor-pointer text-sm">
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setNewImageFile(file);
                setImage(URL.createObjectURL(file));
                setEditField("image");
              }
            }}
          />
          Change Image
        </label>
        {editField === "image" && (
          <div className="flex mt-2 space-x-2">
            <FaCheck
              className="text-green-500 cursor-pointer"
              onClick={updateImageField}
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
