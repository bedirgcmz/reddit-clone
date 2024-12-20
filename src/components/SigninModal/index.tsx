import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react"; // useEffect ekleyin
import { useFetchContext } from "@/context/FetchContext";
import { useGeneralContext } from "@/context/GeneralContext";
import supabase from "@/lib/supabaseClient"; 
import { setLocalStorage } from "@/utils/helpers";
// import { useRouter } from "next/navigation";

interface SigninModalProps {
  onClose: () => void;
  onOpenSignup: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({ onClose, onOpenSignup }) => {
  const { users } = useFetchContext();
  const { setCurrentUser } = useGeneralContext(); 
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null); 
  // const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.user) {
          // Eger user giris yapabilirse, giriş yapan kullanıcınin diger bilgilerini users tablosundan getirmek için yeni bir sorgu yapıyoruz.
          const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError) {
          throw new Error(userError.message);
        }
        //gelen users bilgilerini kullanmak
        if (userData) {
          setCurrentUser(userData);
          setLocalStorage('userRedditClone', userData)
          onClose(); 
        } else {
          setError("User not found in the database.");
        }
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full text-2xl flex justify-center items-center text-gray-600 hover:text-orange-300 absolute top-[12px] right-[12px] hover:bg-gray-200"
        >
          <IoClose />
        </button>
        <h2 className="text-xl font-semibold mb-4">Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Log In
          </button>
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer" onClick={onOpenSignup}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SigninModal;
