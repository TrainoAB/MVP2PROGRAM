import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  console.log("🚀 INNE I ROUTE");
  console.log("Request body:", req.body);
  try {
    const body = await req.json();
    const {
      month_number,
      day_number,
      image_url,
      video_url,
      duration,
      title,
      description,
      index_order,
    } = body;

    if (!month_number || !day_number) {
      return NextResponse.json(
        { error: "Månad och dag krävs" },
        { status: 400 }
      );
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return NextResponse.json(
        { error: "Duration måste vara ett positivt heltal" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log("Supabase:", supabase);

    const { data: day, error: selectDayError } = await supabase
      .from("training_days")
      .select("id")
      .eq("month_number", month_number)
      .eq("day_number", day_number)
      .maybeSingle();
    
    console.log("training_day found:", day);
    
    if (selectDayError) {
      console.error("Select error:", selectDayError);
      return NextResponse.json(
        { error: "Kunde inte spara", details: selectDayError.message },
        { status: 500 }
      );
    }

    console.log("Insert exercise with values:", {
      training_day_id: day.id,
      image_url,
      video_url,
      duration,
      title,
      description,
      index_order,
    });

    const { data, error: insertExerciseError } = await supabase
      .from("exercises")
      .insert([
        {
          training_day_id: day.id,
          image_url,
          video_url,
          duration,
          title,
          description,
          index_order,
        },
      ])
      .select();

    if (insertExerciseError) {
      console.error("Insert error details:", insertExerciseError);
      return NextResponse.json(
        { error: "Kunde inte spara", details: insertExerciseError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
