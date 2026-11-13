import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl && process.env.NODE_ENV !== 'test') {
  console.warn('[WARN] SUPABASE_URL is not set. Ensure .env is properly configured.');
}

/**
 * Public/Anon client for general operations and auth token verification
 */
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Privileged Service-Role client for backend-exclusive tasks (e.g. storage signed URLs if needed)
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabasePublic;

/**
 * Creates a user-scoped Supabase client that carries the farmer's JWT.
 * This guarantees Row-Level Security (RLS) enforcement on all database queries.
 *
 * @param {string} token - The farmer's Supabase JWT access token
 * @returns SupabaseClient
 */
export const createUserClient = (token) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};

