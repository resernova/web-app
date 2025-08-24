'use client';
import React from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AssistantIcon from '@mui/icons-material/Assistant';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Neural network pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <pattern id="neural-pattern-auth" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="currentColor" className="text-[#E76F51]" />
            <path d="M50 50 L100 100 M50 50 L0 100 M50 50 L100 0 M50 50 L0 0"
              stroke="currentColor"
              strokeWidth="0.7"
              className="text-[#E76F51]" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern-auth)" />
        </svg>

        {/* Glowing orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#E76F51]/10 to-[#F4A261]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-[#FFB366]/10 to-[#F4A261]/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#E76F51]/5 to-[#FFB366]/5 rounded-full blur-[140px] animate-pulse delay-500" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-orange-100/50 sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <AssistantIcon className="h-8 w-8 text-[#E76F51] group-hover:text-[#D65A42] transition-colors duration-200" />
                <div className="absolute inset-0 bg-[#E76F51]/20 rounded-full blur-md group-hover:bg-[#E76F51]/30 transition-all duration-200" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#E76F51] via-[#F4A261] to-[#FFB366] bg-clip-text text-transparent group-hover:from-[#D65A42] group-hover:via-[#E76F51] group-hover:to-[#F4A261] transition-all duration-200">
                ReserNova
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-[#E76F51] font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-orange-50"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-medium px-6 py-2.5 rounded-lg hover:from-[#D65A42] hover:to-[#E76F51] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="sm:hidden p-2 text-gray-600 hover:text-[#E76F51] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto py-8 px-4 text-center">
        <div className="text-gray-500 text-sm">
          <p className="mb-2">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-[#E76F51] hover:text-[#D65A42] underline transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#E76F51] hover:text-[#D65A42] underline transition-colors">
              Privacy Policy
            </Link>
          </p>
          <p className="text-gray-400">
            © {new Date().getFullYear()} ReserNova. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="rounded-lg shadow-lg"
        progressClassName="bg-gradient-to-r from-[#E76F51] to-[#F4A261]"
      />
    </div>
  );
}