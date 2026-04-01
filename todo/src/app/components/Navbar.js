"use client";

import Image from "next/image";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-72 right-0 h-16 flex justify-between items-center px-6 bg-blue-500 shadow z-40">
      
      <h1 className="text-xl font-semibold text-blue-600">
        
      </h1>

      <UserMenu />

    </div>
  );
}