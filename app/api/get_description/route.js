import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const programId = searchParams.get("programId");

  console.log("Parsed params:", { programId });

  if (!programId) {
    return NextResponse.json(
      { success: false, message: "Missing programId, day or month" },
      { status: 400 }
    );
  }
  console.log("Query params:", { programId });

  try {
    const { data: trainingProgram, error } = await supabase
      .from("training_programs")
      .select("description, video_url, image_url")
      .eq("id", programId)
      .single();

      if (error) {
        console.error("Supabase error:", error.message);
        return NextResponse.json(
          {
            success: false,
            message: "Error fetching training program",
            details: error.message,
          },
          { status: 500 }
        );
    }
    
    if (!trainingProgram) {
      return NextResponse.json(
        { success: true, description: null },
        { status: 204 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        description: trainingProgram.description,
        video_url: trainingProgram.video_url || null,
        image_url: trainingProgram.image_url || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", err.message);
    return NextResponse.json(
      { success: false, message: "Unexpected server error" },
      { status: 500 }
    );
  }
}
