// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RpGskill",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
  
          <main className="flex-grow">
            {children}
          </main>
      </body>
    </html>
  );
}
