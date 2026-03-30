// src/app/(protected)/layout.js

import Navbar from "../components/Navbar";

export default function ProtectedLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}