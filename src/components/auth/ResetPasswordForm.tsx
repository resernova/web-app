'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { updatePassword } from '@/lib/auth';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, ArrowRightIcon } from '@/components/ui/Icons';

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokens, setTokens] = useState<{ access_token?: string; refresh_token?: string }>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    
    if (access_token && refresh_token) {
      setTokens({ access_token, refresh_token });
    } else {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/auth/forgot-password');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(formData.password);
      setSuccess(true);
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
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

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, color: 'bg-gray-200', text: '' };
    if (password.length < 8) return { strength: 1, color: 'bg-red-500', text: 'Too short' };
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 3, color: 'bg-green-500', text: 'Strong' };
    }
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 2, color: 'bg-yellow-500', text: 'Good' };
    }
    return { strength: 1, color: 'bg-red-500', text: 'Weak' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <div className="w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
          <CheckCircleIcon className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Password Updated!
        </h1>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Your password has been successfully updated. You can now sign in with your new password.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What's next?
          </h3>
          <div className="space-y-3 text-sm text-gray-700 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>Your password is now secure</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>You can sign in with your new password</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span>Keep your password safe and don't share it</span>
            </div>
          </div>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white rounded-xl font-semibold text-lg hover:from-[#D65A42] hover:to-[#E76F51] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Sign In Now
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-2xl mb-4 shadow-lg">
          <LockClosedIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Set New Password
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a strong password for your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
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
              minLength={8}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Enter your new password"
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
          
          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength.strength === 3 ? 'text-green-600' :
                  passwordStrength.strength === 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Use at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password match indicator */}
          {formData.confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {formData.password === formData.confirmPassword ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Passwords match</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 text-red-500">✕</div>
                  <span className="text-xs text-red-600 font-medium">Passwords don't match</span>
                </>
              )}
            </div>
          )}
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
              Updating Password...
            </div>
          ) : (
            'Update Password'
          )}
        </button>
      </form>

      {/* Password Requirements */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Password Requirements
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span>At least 8 characters long</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              /[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span>Contains lowercase letter</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span>Contains uppercase letter</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              /\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            <span>Contains number</span>
          </div>
        </div>
      </div>

      {/* Back to Login */}
      <div className="mt-8 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-6 py-4 border-2 border-[#E76F51] rounded-xl font-semibold text-[#E76F51] bg-white hover:bg-[#E76F51] hover:text-white focus:ring-4 focus:ring-[#E76F51]/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
