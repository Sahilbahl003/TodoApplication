import Link from "next/link";
import "./global.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-gray-100">

        <h1 className="text-3xl mt-5 text-center">
          {/* <Link href="/">Todo Application</Link> */}
        </h1>

        {children}
        <ToastContainer position="top-right" />

      </body>
    </html>
  );
}
