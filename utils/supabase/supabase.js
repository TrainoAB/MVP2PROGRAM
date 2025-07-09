import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Supabase-url eller service-role-key saknas i .env.local");
}

// Denna klient används endast på servern (SSR och API routes)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  schema: "public",
});
