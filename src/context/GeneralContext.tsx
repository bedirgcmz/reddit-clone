

"use client";
import { getLocalStorage } from '@/utils/helpers';
import { FavoritesDataTypes, UsersDataTypes } from '@/utils/types';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type GeneralContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSigninModalOpen: boolean;
  setIsSigninModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignupModalOpen: boolean;
  setIsSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdateCommentModalOpen: boolean;
  setUpdateCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UsersDataTypes | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UsersDataTypes | null>>;
  updateCommentId: string | null; 
  setUpdateCommentId: React.Dispatch<React.SetStateAction<string | null>>; 
  favorites: FavoritesDataTypes[] | null;
  setfavorites: React.Dispatch<React.SetStateAction<FavoritesDataTypes[] | null>>
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateCommentModalOpen, setUpdateCommentModalOpen] = useState(false);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null); 
  const [currentUser, setCurrentUser] = useState<UsersDataTypes | null>(null); 
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [favorites, setfavorites] = useState<FavoritesDataTypes[] | null>([]) // Burasi profile/favorite sayfasina gidiyor

  
  useEffect(() => {
    if(getLocalStorage("userRedditClone")){
      setCurrentUser(getLocalStorage("userRedditClone"))
    }
  },[])
  return (
    // GeneralContext.Provider'a setUpdateCommentId ve updateCommentId eklendi.

    <GeneralContext.Provider 
      value={{ 
        isSidebarOpen, 
        setIsSidebarOpen, 
        currentUser, 
        setCurrentUser, 
        isUpdateCommentModalOpen, 
        setUpdateCommentModalOpen, 
        updateCommentId, 
        setUpdateCommentId,
        setIsSigninModalOpen, 
        isSigninModalOpen, 
        isSignupModalOpen, 
        setIsSignupModalOpen,
        favorites, 
        setfavorites
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (context === undefined) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};
