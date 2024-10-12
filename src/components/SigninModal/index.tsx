import { IoClose } from "react-icons/io5";

interface SigninModalProps {
  onClose: () => void;
  onOpenSignup: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({ onClose, onOpenSignup }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" >
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button onClick={onClose}  className="w-8 h-8 rounded-full text-2xl flex justify-center items-center text-gray-600 hover:text-orange-300 absolute top-[12px] right-[12px]  hover:bg-gray-200"><IoClose /></button>
        <h2 className="text-xl font-semibold mb-4">Log In</h2>
        <form className=''>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-500">Log In</button>
        </form>
        <p className="mt-4">
          Don't have an account?{' '}
          <span className="text-blue-600 cursor-pointer" onClick={onOpenSignup}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default SigninModal;
