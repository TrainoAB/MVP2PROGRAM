import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
