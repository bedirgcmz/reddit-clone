

"use client";
import { UsersDataTypes } from '@/utils/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// GeneralContextType'e updateCommentId ve setUpdateCommentId'yi ekledim.
type GeneralContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdateCommentModalOpen: boolean;
  setUpdateCommentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UsersDataTypes | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UsersDataTypes | null>>;
  updateCommentId: string | null; 
  setUpdateCommentId: React.Dispatch<React.SetStateAction<string | null>>; 
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateCommentModalOpen, setUpdateCommentModalOpen] = useState(false);
  const [updateCommentId, setUpdateCommentId] = useState<string | null>(null); 
  const [currentUser, setCurrentUser] = useState<UsersDataTypes | null>(null); 
  
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
        setUpdateCommentId 
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
