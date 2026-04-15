import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Profile = {
  id: string;
  email: string;
  name: string;
  role: 'Customer' | 'agent';
  avatar?: string;
  company?: string;
  phone?: string;
  position?: string;
  location?: string;
  bio?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
  status?: "active" | "inactive";
  tier?: 'Premium' | 'Standard' | 'Basic' | 'Enterprise';
  member_since?: string;
  total_tickets?: number;
  resolved_tickets?: number;
  satisfaction?: number;
  open_tickets?: number;
  urgent_tickets?: number;
  tags?: string[];
  avatar_url?: string;
  language?: string;
  date_format?: string;
  time_format?: string;
  dateFormat?: string;
  timeFormat?: string;
};
  // Add these fields to your Profile type in src/lib/Supabase.ts


// Helper to get the current user's profile
export const getCurrentUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile as Profile;
};
