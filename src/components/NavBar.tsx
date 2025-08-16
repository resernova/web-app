"use client";
import Image from "next/image";
import CatMenu from "./ui/Menu";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-xl border-b border-[#E5E7EB]"
    >
      <div className="flex px-1 py-3 max-w-7xl mx-auto justify-between items-center gap-2">
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl shadow-md bg-white p-1 border border-[#E5E7EB]"
          />
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-extrabold text-[#E76F51] tracking-tight drop-shadow-md">ReserNova</h1>
            <p className="text-xs text-gray-500 -mt-1 tracking-wide font-medium">Smart Reservations, Simplified</p>
          </div>
        </Link>
        <div className="flex items-center gap-6 ml-2">
          <CatMenu />
          <Link
            href="/companies"
            className="text-[#222831] text-base font-semibold 
             transition-colors duration-200 p-2 border-[#E5E7EB] rounded-full border-[1px] hover:bg-gray-300/50"
          >
            Companies
          </Link>
          <Link
            href="/bookings"
            className="text-[#222831] text-base font-semibold
             transition-colors duration-200 p-2 border-[#E5E7EB] rounded-full border-[1px] hover:bg-gray-300/50"
          >
            My Bookings
          </Link>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Link
            href="/login"
            className="px-5 py-2 rounded-3xl bg-white text-[#222831] font-bold 
            shadow-lg hover:bg-[#FFB366] hover:text-white border border-[#E5E7EB] transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-3xl bg-[#E76F51] text-white font-bold 
              shadow-3xl hover:bg-[#FFB366] hover:text-white border border-[#E5E7EB] transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
