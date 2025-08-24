'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from '@/lib/auth';
import { PersonIcon, BusinessIcon, EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@/components/ui/Icons';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { role } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer' as 'customer' | 'business'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error((error as any)?.message || 'Login failed. Please check your credentials.');
        return;
      }

      if (data?.user) {
        toast.success(`Welcome back, ${data.user.email}!`);

        // Use a small delay to allow AuthContext to update
        setTimeout(() => {
          // Redirect based on the user's role
          if (role === 'business') {
            router.replace('/dashboard');
          } else {
            router.replace('/');
          }
        }, 10);
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserTypeChange = (type: 'customer' | 'business') => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-2xl mb-4 shadow-lg">
          <PersonIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-lg">
          Sign in to your ReserNova account
        </p>
      </div>

      {/* User Type Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          I am a...
        </label>
        <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => handleUserTypeChange('customer')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.userType === 'customer'
                ? 'bg-white text-[#E76F51] shadow-md transform scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <PersonIcon className="w-5 h-5" />
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleUserTypeChange('business')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.userType === 'business'
                ? 'bg-white text-[#E76F51] shadow-md transform scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <BusinessIcon className="w-5 h-5" />
            Business
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-[#E76F51] hover:text-[#D65A42] font-medium transition-colors hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#D65A42] hover:to-[#E76F51] focus:ring-4 focus:ring-[#E76F51]/30 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing In...
            </div>
          ) : (
            'Sign In'
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
              Don't have an account?
            </span>
          </div>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center w-full px-6 py-4 border-2 border-[#E76F51] rounded-xl font-semibold text-[#E76F51] bg-white hover:bg-[#E76F51] hover:text-white focus:ring-4 focus:ring-[#E76F51]/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Create New Account
        </Link>
      </div>

      {/* Benefits */}
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {formData.userType === 'customer' ? 'Customer Benefits' : 'Business Benefits'}
        </h3>
        <div className="space-y-3">
          {formData.userType === 'customer' ? (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>Book services and appointments easily</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>Manage your bookings in one place</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>Save favorite providers and services</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>List and manage your services</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>Handle appointments and bookings</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-2 h-2 bg-[#E76F51] rounded-full flex-shrink-0" />
                <span>Connect with customers directly</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}