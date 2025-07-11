// app/api/get_day_image_or_video/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get("programId");
  const month = searchParams.get("month");
  const day = searchParams.get("day");

  if (!programId || !month || !day) {
    return NextResponse.json(
      { success: false, message: "programId, month och day krävs." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("training_days")
    .select("image_url, video_url, inserted_at")
    .eq("training_program_id", programId)
    .eq("month_number", month)
    .eq("day_number", day)

  if (error) {
    console.error("Fel vid hämtning:", error.message);
    return NextResponse.json(
      { success: false, message: "Kunde inte hämta training day." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}

