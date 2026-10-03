import { createClient } from '@supabase/supabase-js';

// Server-side public reads (Server Components) — uses the anon/publishable
// key, so Row Level Security still applies (only active=true products are
// visible). Separate from supabaseServer.js (service role, admin-only
// writes) so a storefront page can never accidentally see hidden products.
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}
