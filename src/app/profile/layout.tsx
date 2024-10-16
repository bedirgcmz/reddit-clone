
import ProfileNavbar from "@/components/ProfileNavbar";
import ProfilePage from "@/components/ProfilePage";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  
    return (
      
                <main className="flex flex-col md:gap-2 h-calc">
                  <div className="">
                    <ProfilePage />
                    <ProfileNavbar />
                  </div>
                  <div className="aa">
                  {children}
                  </div>
                </main>
    );
  }