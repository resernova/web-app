'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser, signOut, UserRole, UserProfile, ServiceProvider } from '@/lib/auth';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  provider: ServiceProvider | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      console.log('AuthContext: refreshUser called');
      const { user: currentUser, profile: currentProfile, provider: currentProvider, role: currentRole } = await getCurrentUser();

      console.log('AuthContext: getCurrentUser result:', {
        user: currentUser?.email,
        profile: !!currentProfile,
        provider: !!currentProvider,
        role: currentRole
      });

      setUser(currentUser);
      setProfile(currentProfile);
      setProvider(currentProvider);
      setRole(currentRole as UserRole);

      // If we just logged in and are on an auth page, redirect
      if (window.location.pathname.startsWith('/auth/') && currentUser) {
        console.log('Redirecting from auth page...');
        setTimeout(() => {
          if (currentRole === 'business') {
            router.replace('/dashboard');
          } else {
            router.replace('/');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      setProvider(null);
      setRole(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Get initial user session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, refreshing user data...');
          await refreshUser();
          // If we're on an auth page, redirect to home
          if (window.location.pathname.startsWith('/auth/')) {
            console.log('Redirecting from auth page...');
            setTimeout(async () => {
              // Get the current role after refreshUser has updated the state
              const { role: userRole } = await getCurrentUser();
              if (userRole === 'business') {
                router.replace('/dashboard');
              } else {
                router.replace('/');
              }
            }, 500);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state...');
          setUser(null);
          setProfile(null);
          setProvider(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    provider,
    role,
    loading,
    signOut: handleSignOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
