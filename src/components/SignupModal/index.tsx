

import supabase from "@/lib/supabaseClient";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import Swal from "sweetalert2";  
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface SignupModalProps {
  onClose: () => void;
  onOpenSignin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onClose, onOpenSignin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let imageUrl = null;
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("users-images")
        .upload(fileName, image);

      if (uploadError) {
        MySwal.fire({
          icon: 'error',
          title: 'Image Upload Failed',
          text: uploadError.message,
        });
        return;
      }

      imageUrl = supabase.storage.from("users-images").getPublicUrl(fileName).data.publicUrl;
    }

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message === "User already registered") {
          MySwal.fire({
            icon: 'warning',
            title: 'User already registered',
            text: 'This email is already associated with an account.',
          });
          return;
        }
        throw authError;
      }

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              password,
              created_at: data.user.created_at,
              fullname: fullName,
              username,
              image: imageUrl,
              role: 'user',
            },
          ]);

        if (insertError) {
          MySwal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: insertError.message,
          });
          return;
        }

        MySwal.fire({
          icon: 'success',
          title: 'Signup Successful',
          text: 'Your account has been created!',
        }).then(() => {
          onClose(); 
          onOpenSignin(); 
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        MySwal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: error.message,
        });
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Signup Failed',
          text: 'An unknown error occurred during signup.',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full text-2xl flex justify-center items-center text-gray-600 hover:text-orange-300 absolute top-[12px] right-[12px] hover:bg-gray-200"
        >
          <IoClose />
        </button>
        <form onSubmit={handleSignup}>
          <label className="block text-sm mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label className="block text-sm mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="block text-sm mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-sm mb-2">Profile Image (Optional)</label>
          <input
            type="file"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />

          <button
            type="submit"
            className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-500"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{' '}
          <span className="text-blue-600 cursor-pointer" onClick={onOpenSignin}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
