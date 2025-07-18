import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get("programId");
  const month = searchParams.get("month");
  const day = searchParams.get("day");
  console.log("Parsed params:", { programId, month, day });

  if (!programId || !month || !day) {
    return NextResponse.json(
      { success: false, message: "programId, month och day krävs." },
      { status: 400 }
    );
  }
  const supabase = await createClient();

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

