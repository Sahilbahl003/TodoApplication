import Link from "next/link";
import "./global.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-gray-100">

        <h1 className="text-3xl mt-5 text-center">
          {/* <Link href="/">Todo Application</Link> */}
        </h1>

        {children}

      </body>
    </html>
  );
}
