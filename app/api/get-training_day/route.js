// app/api/get-training-day/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const programId = searchParams.get("programId");
  const day = Number(searchParams.get("day"));
  const month = Number(searchParams.get("month"));

  if (!programId || !day || !month) {
    return NextResponse.json(
      { success: false, message: "Missing params" },
      { status: 400 }
    );
  }

  try {
    const { data: trainingDay, error } = await supabase
      .from("training_days")
      .select("image_url, video_url")
      .eq("training_program_id", programId)
      .eq("month_number", month)
      .eq("day_number", day)
      .single();

    if (error) throw error;

    return NextResponse.json(
      { success: true, data: trainingDay },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
