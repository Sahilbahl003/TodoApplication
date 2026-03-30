"use client";

import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-semibold text-blue-600">
        Todo App
      </h1>

      {/* Right side */}
      <UserMenu />
    </div>
  );
}