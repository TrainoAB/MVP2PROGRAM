import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  console.log("Method:", req.method);
  const url = new URL(req.url);

  const exerciseId = url.searchParams.get("exercise_id");

  console.log("Parsed params:", { exerciseId });

  if (!exerciseId) {
    return NextResponse.json(
      { success: false, message: "Missing exerciseId" },
      { status: 400 }
    );
  }
  console.log("Query params:", { exerciseId });

  try {
    const { data: exerciseNote, error } = await supabase
      .from("exercise_notes")
      .select("id, content")
      .eq("exercise_id", exerciseId)
      .maybeSingle();

    if (error) throw error;

    if (!exerciseNote) {
      return NextResponse.json({ success: true, data: null }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, data: exerciseNote },
      { status: 200 }
    );
     } catch (error) {
       console.error("Supabase error:", error);
     return NextResponse.json(
    { success: false, message: error.message },
    { status: 500 }
    );
  }
}
