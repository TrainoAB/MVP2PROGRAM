import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function GET(req) {
try {
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId");
  console.log("Request URL:", req.url);

  console.log("Parsed params:", { programId });

  if (!programId) {
    return NextResponse.json(
      { success: false, message: "Missing programId, day or month" },
      { status: 400 }
    );
  }
  console.log("Query params:", { programId });

  const { data, error } = await supabase
    .from("training_programs")
    .select("description, video_url, image_url")
    .eq("id", programId)
    .single();

      if (error || !data) {
        console.error("Supabase error:", error.message);
        return NextResponse.json(
          {
            success: false,
            message: "Error fetching description",
            details: error?.message,
          },
          { status: 404 }
        );
    }
    
    return NextResponse.json(
      {
        success: true,
        description: data.description,
        video_url: data.video_url || null,
        image_url: data.image_url || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error.message);
    return NextResponse.json(
      { success: false, message: "Unexpected server error" },
      { status: 500 }
    );
  }
}
