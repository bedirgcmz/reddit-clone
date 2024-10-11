// src/context/GeneralContext.tsx
"use client";
import React, { createContext, useState, useContext, ReactNode } from 'react';

// GeneralContext için bir tür tanımlıyoruz
type GeneralContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Başlangıç değerleri
const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

// Provider bileşeni oluşturma
export const GeneralProvider = ({ children }: { children: ReactNode }) => {
  // Paylaşılacak state'leri tanımlıyoruz
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <GeneralContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </GeneralContext.Provider>
  );
};

// Custom hook ile GeneralContext'i kolayca kullanma
export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (context === undefined) {
    throw new Error("useGeneralContext must be used within a GeneralProvider");
  }
  return context;
};
