import React, { useState } from 'react';
import SigninModal from '@/components/SigninModal';
import SignupModal from '@/components/SignupModal';

const App: React.FC = () => {
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openSigninModal = () => {
    setShowSigninModal(true);
    setShowSignupModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowSigninModal(false);
  };

  const closeModal = () => {
    setShowSigninModal(false);
    setShowSignupModal(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <button
        onClick={openSigninModal}
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-500"
      >
        Sign In
      </button>
      <button
        onClick={openSignupModal}
        className="px-4 py-2 mt-4 text-white bg-green-600 rounded hover:bg-green-500"
      >
        Sign Up
      </button>

      {showSigninModal && <SigninModal onClose={closeModal} onOpenSignup={openSignupModal} />}
      {showSignupModal && <SignupModal onClose={closeModal} onOpenSignin={openSigninModal} />}
    </div>
  );
};

export default App;
