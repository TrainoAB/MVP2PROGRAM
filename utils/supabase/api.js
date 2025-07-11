import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function fetchTrainingDay({ request, programId, month, day }) {
  const response = new Response(); 

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("training_days")
    .select("image_url, video_url, saved_date")
    .eq("program_id", programId)
    .eq("month", month)
    .eq("day", day)
    .single();
  if (error) throw error;

  return data;
}
