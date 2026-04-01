"use client"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"
import { DateProvider } from "@/context/DateContext"

export default function ProtectedLayout({ children }) {

  return (

    <DateProvider>

      <div className="min-h-screen bg-gray-100">

        {/* Sidebar */}
        <Sidebar />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="ml-72 pt-16 p-6">
          {children}
        </div>

      </div>

    </DateProvider>

  )
}