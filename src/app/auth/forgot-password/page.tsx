'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { resetPassword } from '@/lib/auth';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon } from '@/components/ui/Icons';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
          <CheckCircleIcon className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Check Your Email
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>
        </p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What happens next?
          </h3>
          <div className="space-y-3 text-sm text-gray-700 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>Check your email inbox (and spam folder)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>Click the reset link in the email</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>Create a new password</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white rounded-xl font-semibold text-lg hover:from-[#D65A42] hover:to-[#E76F51] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Sign In
          </Link>
          
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center w-full px-6 py-4 border-2 border-[#E76F51] text-[#E76F51] rounded-xl font-semibold hover:bg-[#E76F51] hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Send Another Email
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#E76F51] hover:text-[#D65A42] underline font-medium"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-2xl mb-4 shadow-lg">
          <EnvelopeIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Forgot Password?
        </h1>
        <p className="text-gray-600 text-lg">
          No worries! Enter your email and we'll send you reset instructions
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#D65A42] hover:to-[#E76F51] focus:ring-4 focus:ring-[#E76F51]/30 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            'Send Reset Link'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50 text-gray-500 font-medium">
              Remember your password?
            </span>
          </div>
        </div>
      </div>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-6 py-4 border-2 border-[#E76F51] rounded-xl font-semibold text-[#E76F51] bg-white hover:bg-[#E76F51] hover:text-white focus:ring-4 focus:ring-[#E76F51]/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Sign In
        </Link>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Need Help?
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            <span>Check your email address is correct</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            <span>Look in your spam/junk folder</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            <span>Wait a few minutes for delivery</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/contact"
            className="text-[#E76F51] hover:text-[#D65A42] text-sm font-medium underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
