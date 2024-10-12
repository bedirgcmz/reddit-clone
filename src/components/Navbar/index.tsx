

"use client"
import { useState } from 'react';
import SigninModal from '@/components/SigninModal'; 
import SignupModal from '@/components/SignupModal'; 
import { IoSearch } from "react-icons/io5";
import Sidebar from '@/components/Sidebar';
import { useGeneralContext } from '@/context/GeneralContext';
import Link from 'next/link';



const Navbar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useGeneralContext();
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleOpenSignup = () => {
    setIsSignupModalOpen(true);
    setIsSigninModalOpen(false);
  };

  const handleOpenSignin = () => {
    setIsSigninModalOpen(true);
    setIsSignupModalOpen(false);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-8 py-2">
      {/* Hamburger Menu Icon - only visible on screens smaller than 768px */}
      <button
        className="block md:hidden p-2 focus:outline-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="Reddit Logo" className="w-10 h-10 mr-2" />
          <span className="font-bold text-2xl hidden md:inline text-orange-400">reddit</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-4 text-center search-input-field">
        <span className='relative'>
          <input
            type="text"
            placeholder="Search Reddit"
            className=" w-full max-w-[600px] h-10 ps-10 pe-4 py-2 rounded-full focus:outline-none bg-gray text-sm"
          />
          <IoSearch className="absolute top-[1px] left-[16px] text-xl text-[#808080]" />
        </span>
      </div>

      {/* Right Icons */}
      <div className="flex items-center md:space-x-4">
        <button className="hidden md:flex items-center bg-gray text-sm py-2 px-4 rounded-full">
          Get App
        </button>
        <button
          className="bg-orange text-white text-[12px] md:text-sm py-[10px] px-[20px] me-2 md:me-0 md:py-2 md:px-4 rounded-full"
          onClick={handleOpenSignin}
        >
          Log In
        </button>
        <button
          className="relative"
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
        >
          <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            ...
          </span>
          {/* Dropdown Menu */}
          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded shadow-xl">
              <button
                onClick={handleOpenSignin}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Log In
              </button>
              <button
                onClick={handleOpenSignup}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              >
                Sign Up
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        
       <Sidebar />
      )}

      {/* Modals */}
      {isSigninModalOpen && (
        <SigninModal 
          onClose={() => setIsSigninModalOpen(false)} 
          onOpenSignup={handleOpenSignup} 
        />
      )}
      {isSignupModalOpen && (
        <SignupModal 
          onClose={() => setIsSignupModalOpen(false)} 
          onOpenSignin={handleOpenSignin} 
        />
      )}
    </nav>
  );
};

export default Navbar;
