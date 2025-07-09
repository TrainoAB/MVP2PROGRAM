import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function fetchTrainingDay() {
  const cookieStore = cookies();

  const cookieMethods = {
    getAll: (key) => cookieStore.getAll(key).map((c) => c.value),
    setAll: (key, values) => {},
  };

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { cookies: cookieMethods }
  );

  const { data, error } = await supabase
    .from("training_days")
    .select("*")
    .limit(1);
  if (error) throw error;

  return data;
}
