
import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { GeneralProvider, useGeneralContext } from '@/context/GeneralContext'; 
import { FetchProvider } from "@/context/FetchContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import CreatePostModalButton from "@/components/CreatePostModalButton";

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "Generated by Bedir Gocmez",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { currentUser } = useGeneralContext();

  return (
    <html lang="en">
      <body
        className="pt-[66px]"
      >
          <GeneralProvider>
          <FetchProvider>
              <Navbar />
              <main className="flex md:gap-2 h-calc">
                <div className="sidebar hide md:flex md:w-[280px] border-e">
                  <Sidebar />
                </div>
                <div className="main-content w-full overflow-auto">
                {children}
                </div>
              </main>

          </FetchProvider>
        
        </GeneralProvider>
      </body>
    </html>
  );
}
