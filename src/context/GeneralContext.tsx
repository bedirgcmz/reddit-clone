
"use client";
import { UsersDataTypes } from '@/utils/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';


type GeneralContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: UsersDataTypes | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UsersDataTypes | null>>;
};

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UsersDataTypes | null>(null); 
  
  return (
    <GeneralContext.Provider value={{ isSidebarOpen, setIsSidebarOpen, currentUser, setCurrentUser }}>
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
