// src/features/auth/authAPI.ts
import { supabase } from '../../lib/Supabase';
import type { Profile } from '../../lib/Supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}

export interface User extends Profile {}

export const authAPI = {
  // Login with email/password
  login: async (credentials: LoginCredentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: profile as User,
      session: data.session,
    };
  },

  // Sign up new user
  signup: async (data: SignupData) => {
    // 1. Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('No user returned from signup');

    // 2. Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: 'user', // Default role
          company: data.company,
          phone: data.phone,
        },
      ]);

    if (profileError) throw profileError;

    // 3. Fetch the created profile
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (fetchError) throw fetchError;

    return {
      user: profile as User,
      session: authData.session,
    };
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user with profile
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile as User;
  },

  // Update profile
  updateProfile: async (userId: string, data: Partial<User>) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return profile as User;
  },

  // Password reset
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },

  // Demo login helper (for development)
  demoLogin: async (role: 'user' | 'agent') => {
    if (role === 'user') {
      return authAPI.login({ email: 'customer@example.com', password: 'password123' });
    } else {
      return authAPI.login({ email: 'agent@supporthub.com', password: 'password123' });
    }
  },
};