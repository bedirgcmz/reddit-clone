// import { CommentsDataTypes } from "./types";

export function timeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
    const units = [
      { name: "yr", seconds: 31536000 },  // 60 * 60 * 24 * 365
      { name: "mo", seconds: 2592000 },   // 60 * 60 * 24 * 30
      { name: "day", seconds: 86400 },    // 60 * 60 * 24
      { name: "hr", seconds: 3600 },      // 60 * 60
      { name: "min", seconds: 60 },       // 60
      { name: "sec", seconds: 1 }
    ];
  
    for (const unit of units) {
      const interval = Math.floor(diffInSeconds / unit.seconds);
      if (interval >= 1) {
        return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
      }
    }
  
    return "just now";
  }

//  //sortByDate.ts
//  export const sortCommentsByDate = (comments: CommentsDataTypes[]): CommentsDataTypes[] => {
//   return comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
// };


import Swal from "sweetalert2";
type SwalAlertProps = {
  icon: "success" | "error" | "warning" | "info" | "question"; // SweetAlert2'nin desteklediği icon türleri
  title: string;
  text: string;
};

export const mySwalAlert = ({ icon, title, text }: SwalAlertProps) => {
  return Swal.fire({
    icon: icon, 
    title: title, 
    text: text,   
  });
};



/* SweetAlert2'nin desteklediği ikonlar:
   - success    : Başarılı durumlar için
   - error      : Hata durumları için
   - warning    : Uyarı durumları için
   - info       : Bilgi verme amaçlı
   - question   : Soru veya onaylama gerektiren durumlar için
*/


type ConfirmAlertProps = {
  title: string;
  text: string;
  confirmButtonText?: string; // Opsiyonel özelleştirme için
  cancelButtonText?: string;  // Opsiyonel özelleştirme için
};

export const confirmAlert = async ({ 
  title, 
  text, 
  confirmButtonText = "Yes, do it!", 
  cancelButtonText = "Cancel" 
}: ConfirmAlertProps): Promise<boolean> => {
  const result = await Swal.fire({
    title: title,            // Başlık
    text: text,              // Açıklama metni
    icon: "warning",         // Uyarı ikonunu kullanıyoruz
    showCancelButton: true,  // Cancel butonunu göster
    confirmButtonColor: "#3085d6",  // OK butonunun rengi
    cancelButtonColor: "#d33",      // Cancel butonunun rengi
    confirmButtonText: confirmButtonText, // OK buton metni
    cancelButtonText: cancelButtonText,   // Cancel buton metni
  });

  // Eğer kullanıcı OK butonuna tıklarsa `true`, aksi halde `false` döner
  return result.isConfirmed;
};

export const showLoginModalIfNotAuthenticated = (
  isAuthenticated: boolean,
  openLoginModal: () => void
) => {
  if (!isAuthenticated) {
    Swal.fire({
      title: "Login Required",
      text: "You need to log in to access this feature.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        openLoginModal(); // Login modali açılır
      }
    });
  }
};

 
  