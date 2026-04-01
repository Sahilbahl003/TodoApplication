"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [userInitial, setUserInitial] = useState("U");
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); 
      if (storedUser?.name) {
        setUserInitial(storedUser.name.charAt(0).toUpperCase());
      }
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
    setUser(null);
    router.push("/login");
  }

  return (
    <div className="relative flex items-center gap-2 right-0" ref={menuRef}>

      
      {!user && (
        <button
          onClick={() => router.push("/login")}
          className="px-3 py-1 bg-blue-600  text-white text-lg cursor-pointer rounded hover:bg-blue-700"
        >
          Login
        </button>
      )}

     
      {user && (
        <>
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center border-2 border-white rounded-full bg-blue-600 text-white font-semibold cursor-pointer"
          >
            {userInitial}
          </div>

          {open && (
            <div className="absolute right-0 mt-30 w-32 bg-white border rounded shadow-md">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Logout <span className="ml-2 text-xl text-red-500">►</span> 
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}