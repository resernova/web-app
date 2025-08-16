'use client'
import HeroSection from "@/components/HeroSection";
import ExploreCategories from "@/components/ExploreCategories";
import NavBar from "@/components/NavBar";
import TravelersFavorite from "@/components/TravelersFavorite";
import Link from "next/link";
import AssistantIcon from '@mui/icons-material/Assistant';
import CopyrightIcon from '@mui/icons-material/Copyright';
import WhyChoose from "@/components/WhyChoose";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white">
      <NavBar />
      <main className="flex flex-col">
        <HeroSection />
        <ExploreCategories />
        <TravelersFavorite />
        <WhyChoose />
      </main>
      <footer className="relative">
        <div className="absolute bg-[#E76F51] text-black" />
        <div className="relative border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2 group">
                  <AssistantIcon className="h-8 w-8 text-[#E76F51] group-hover:text-[#E76F51] transition-colors" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#FFB366] bg-clip-text text-transparent">
                    ReserNova
                  </span>
                </Link>
                <p className="mt-4 text-sm text-black/70">
                  Smart Reservations, Simplified. Experience our seamless, AI-powered platform for all your booking needs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-black">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/categories/accommodation" className="text-sm text-black/70 hover:text-black transition-colors">
                      Accommodation
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/culinary" className="text-sm text-black/70 hover:text-black transition-colors">
                      Culinary
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/entertainment" className="text-sm text-black/70 hover:text-black transition-colors">
                      Entertainment
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories/wellness" className="text-sm text-black/70 hover:text-black transition-colors">
                      Wellness
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-black">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-sm text-black/70 hover:text-black transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-black/70 hover:text-black transition-colors">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-sm text-black/70 hover:text-black transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-black">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-sm text-black/70 hover:text-black transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm text-black/70 hover:text-black transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-sm text-black/70 hover:text-black transition-colors">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-black/20 text-center">
              <p className="text-sm text-black">
                <CopyrightIcon className="text-black text-sm" /> {new Date().getFullYear()} ReserNova. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* AI Neural network lines */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]">
            <pattern id="neural-pattern-footer" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="currentColor" className="text-[#E76F51]" />
              <path d="M50 50 L100 100 M50 50 L0 100 M50 50 L100 0 M50 50 L0 0"
                stroke="currentColor"
                strokeWidth="0.7"
                className="text-[#E76F51]" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern-footer)" />
          </svg>
        </div>

        {/* Glowing orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -left-20 w-72 h-72 bg-[#E76F51]/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute -right-20 w-72 h-72 bg-[#E76F51]/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>
      </footer>
    </div>
  );
}
