"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'; 

export default function ProfileNavbar() {
  const pathname = usePathname(); 
  const [activeLink, setActiveLink] = useState(pathname);

  const links = [
    { name: "Posts", path: "/profile/posts" },
    { name: "Comments", path: "/profile/comments" },
    { name: "Favorites", path: "/profile/favorites" },
    { name: "Account", path: "/profile/account" }
  ];

  return (
    <nav className="flex justify-center items-center gap-2 border-b pb-2">
      {links.map((link) => (
        <Link legacyBehavior key={link.path} href={link.path}>
          <a
            onClick={() => setActiveLink(link.path)}
            className={`py-2 px-4 text-sm font-medium transition-colors duration-200 hover:text-gray-600 hover:bg-gray-100
              ${activeLink === link.path ? "border-b-2 border-orange-400" : ""}`}
          >
            {link.name}
          </a>
        </Link>
      ))}
    </nav>
  );
}
