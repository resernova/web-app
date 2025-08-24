'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signUp } from '@/lib/auth';
import { PersonIcon, BusinessIcon, EyeIcon, EyeSlashIcon, CheckIcon, PhoneIcon, BuildingIcon, EnvelopeIcon, LockClosedIcon } from '@/components/ui/Icons';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone_number: '',
    userType: 'customer' as 'customer' | 'business',
    business_name: '',
    description: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        phone_number: formData.phone_number,
        role: formData.userType,
        business_name: formData.business_name,
        description: formData.description,
      });

      if (error) {
        toast.error((error as any)?.message || 'Registration failed. Please try again.');
        return;
      }

      if (data?.user) {
        toast.success('Registration successful! Please check your email to verify your account.');
        router.push('/auth/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUserTypeChange = (type: 'customer' | 'business') => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#E76F51] to-[#F4A261] rounded-2xl mb-4 shadow-lg">
          <PersonIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Create Account
        </h1>
        <p className="text-gray-600 text-lg">
          Join ReserNova and start your journey
        </p>
      </div>

      {/* User Type Selector */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          I want to join as a...
        </label>
        <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => handleUserTypeChange('customer')}
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              formData.userType === 'customer'
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
            className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              formData.userType === 'business'
                ? 'bg-white text-[#E76F51] shadow-md transform scale-[1.02]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BusinessIcon className="w-5 h-5" />
            Business
          </button>
        </div>
      </div>

      {/* Registration Form */}
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
              minLength={8}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Create a password (min. 8 characters)"
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
            Confirm Password
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
              placeholder="Confirm your password"
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
                  <CheckIcon className="w-4 h-4 text-green-500" />
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

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            {formData.userType === 'customer' ? 'Full Name' : 'Contact Person Name'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
            placeholder={formData.userType === 'customer' ? 'Enter your full name' : 'Enter contact person name'}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Business-specific fields */}
        {formData.userType === 'business' && (
          <>
            <div>
              <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name
              </label>
              <div className="relative">
                <BuildingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md"
                  placeholder="Enter your business name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E76F51]/20 focus:border-[#E76F51] transition-all duration-200 placeholder-gray-400 text-gray-900 bg-white shadow-sm hover:shadow-md resize-none"
                placeholder="Briefly describe your business and services"
              />
            </div>
          </>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleCheckboxChange}
            required
            className="h-5 w-5 text-[#E76F51] focus:ring-[#E76F51] border-gray-300 rounded mt-1 flex-shrink-0"
          />
          <label htmlFor="acceptTerms" className="ml-3 block text-sm text-gray-700 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-[#E76F51] hover:text-[#D65A42] underline font-medium transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#E76F51] hover:text-[#D65A42] underline font-medium transition-colors">
              Privacy Policy
            </Link>
          </label>
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
              Creating Account...
            </div>
          ) : (
            'Create Account'
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
              Already have an account?
            </span>
          </div>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-6 py-4 border-2 border-[#E76F51] rounded-xl font-semibold text-[#E76F51] bg-white hover:bg-[#E76F51] hover:text-white focus:ring-4 focus:ring-[#E76F51]/20 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Sign In
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
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>Book services and appointments easily</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>Manage your bookings in one place</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>Save favorite providers and services</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>List and manage your services</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>Handle appointments and bookings</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CheckIcon className="w-4 h-4 text-[#E76F51] flex-shrink-0" />
                <span>Connect with customers directly</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}