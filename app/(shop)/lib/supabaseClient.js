'use client';

import { createClient } from '@supabase/supabase-js';

// Browser-side Supabase client — uses the public anon key only.
// Row Level Security (RLS) policies in Supabase decide what this key can read/write.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
