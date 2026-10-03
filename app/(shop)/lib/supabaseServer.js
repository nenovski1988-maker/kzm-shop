import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client — uses the service role key, which bypasses RLS.
// NEVER import this file from a component marked 'use client'; it must only
// run inside Server Components, Route Handlers, or Server Actions.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
