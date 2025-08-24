'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VerifyEmail() {
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a verification flow
    const checkVerification = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError('Error checking verification status. Please try again.');
        return;
      }

      if (data?.session?.user) {
        if (data.session.user.identities && data.session.user.identities.length > 0) {
          setMessage('Email verified successfully! Redirecting...');
          
          // Redirect based on user role
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .single();

          setTimeout(() => {
            if (userData?.role === 'business') {
              router.push('/provider/dashboard');
            } else {
              router.push('/dashboard');
            }
          }, 2000);
        } else {
          setMessage('Please check your email for a verification link.');
        }
      } else {
        setMessage('No active session found. Please sign in.');
      }
    };

    checkVerification();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="mt-3 text-base text-gray-700">
                {message}
              </p>
              {message.includes('check your email') && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Didn't receive an email?{' '}
                    <button
                      onClick={async () => {
                        const { error } = await supabase.auth.resend({
                          type: 'signup',
                          email: '', // Will use the current user's email
                        });
                        if (!error) {
                          setMessage('Verification email resent! Please check your inbox.');
                        } else {
                          setError('Failed to resend verification email. Please try again.');
                        }
                      }}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Resend verification email
                    </button>
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
