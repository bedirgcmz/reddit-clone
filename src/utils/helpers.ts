import { CommentsDataTypes } from "./types";

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

 //sortByDate.ts
 export const sortCommentsByDate = (comments: CommentsDataTypes[]): CommentsDataTypes[] => {
  return comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};


  