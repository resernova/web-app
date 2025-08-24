import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/supabase';

// Create Supabase client
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
);

// User roles from schema
export type UserRole = 'admin' | 'business' | 'customer';

// User profile interface based on database schema
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone_number?: string;
  profile_picture?: string;
  payment_methods?: any;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

// Service provider interface
export interface ServiceProvider {
  id: string;
  company_id?: string;
  name: string;
  description?: string;
  location?: any;
  contact_info?: string;
  business_name: string;
  user_id: string;
  service_id?: string;
  created_at: string;
}

// Authentication functions
export const signUp = async (
  email: string,
  password: string,
  userData: {
    name?: string;
    phone_number?: string;
    role: UserRole;
    business_name?: string;
    description?: string;
  }
) => {
  try {
    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: userData.name,
          role: userData.role,
        },
      },
    });

    if (authError) throw authError;

          if (authData.user) {
        try {
          // Create user profile - match the schema structure
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email!,
              name: userData.name,
              phone_number: userData.phone_number,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.warn('Profile creation error:', profileError);
            // Continue without profile - user can still authenticate
          }

          // If business user, create service provider profile
          if (userData.role === 'business' && authData.user) {
            try {
              const { error: providerError } = await supabase
                .from('service_providers')
                .insert({
                  user_id: authData.user.id,
                  name: userData.name || '',
                  business_name: userData.business_name || '',
                  description: userData.description,
                  created_at: new Date().toISOString()
                });

              if (providerError) {
                console.warn('Provider creation error:', providerError);
                // Continue without provider profile
              }
            } catch (providerError) {
              console.warn('Provider creation failed:', providerError);
            }
          }
        } catch (profileError) {
          console.warn('Profile creation failed:', profileError);
          // Continue without profile - user can still authenticate
        }
      }

    return { data: authData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

            // Get user profile and role
        if (data.user) {
          try {
            let { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('email', data.user.email)
              .single();

            if (profileError) {
              console.warn('Profile fetch error:', profileError);
              // Try to create profile if it doesn't exist
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.user_metadata?.display_name || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .select()
                  .single();
                
                if (!createError) {
                  profile = newProfile;
                  console.log('Created new user profile during signin');
                }
              } catch (createError) {
                console.warn('Failed to create profile during signin:', createError);
              }
            }

            // Only check service_providers if the table exists and user has a profile
            let provider = null;
            if (profile) {
              try {
                const { data: providerData, error: providerError } = await supabase
                  .from('service_providers')
                  .select('*')
                  .eq('user_id', data.user.id)
                  .single();

                if (!providerError && providerData) {
                  provider = providerData;
                }
              } catch (providerError) {
                console.warn('Provider fetch error:', providerError);
                // Continue without provider data
              }
            }

            return {
              data: {
                ...data,
                profile: profile || null,
                provider,
                role: provider ? 'business' : 'customer',
              },
              error: null,
            };
          } catch (profileError) {
            console.warn('Profile fetch failed:', profileError);
            // Return basic user data without profile
            return {
              data: {
                ...data,
                profile: null,
                provider: null,
                role: 'customer', // Default to customer
              },
              error: null,
            };
          }
        }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { user: null, profile: null, provider: null, role: null };

    console.log('getCurrentUser called for user:', user.email);

    // Get user profile with error handling - use email instead of id
    let profile = null;
    let provider = null;
    let role = 'customer';

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!profileError) {
        profile = profileData;
      } else {
        console.warn('Profile fetch error:', profileError);
        // If no profile exists, create a basic one
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.display_name || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (!createError) {
            profile = newProfile;
            console.log('Created new user profile');
          }
        } catch (createError) {
          console.warn('Failed to create profile:', createError);
        }
      }
    } catch (profileError) {
      console.warn('Profile fetch failed:', profileError);
    }

    // Only check service_providers if the table exists and user has a profile
    if (profile) {
      try {
        const { data: providerData, error: providerError } = await supabase
          .from('service_providers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!providerError && providerData) {
          provider = providerData;
          role = 'business';
        }
      } catch (providerError) {
        console.warn('Provider fetch failed:', providerError);
        // Don't fail the entire function if this table doesn't exist
      }
    }

    return { user, profile, provider, role };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return { user: null, profile: null, provider: null, role: null };
  }
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateProviderProfile = async (providerId: string, updates: Partial<ServiceProvider>) => {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .update(updates)
      .eq('id', providerId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Password reset
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Update password
export const updatePassword = async (password: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};
