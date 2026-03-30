"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("U");
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // get user from localStorage (you can store name during login)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) {
      setUserInitial(user.name.charAt(0).toUpperCase());
    }
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold cursor-pointer"
      >
        {userInitial}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}