import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  console.log("🔍 In API: /api/get-exercises");
  console.log("Method:", req.method);
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const programId = searchParams.get("programId");
  const day = Number(searchParams.get("day"));
  const month = Number(searchParams.get("month"));
  console.log("Parsed params:", { programId, day, month });

  if (!programId || isNaN(day) || isNaN(month)){
    return NextResponse.json(
      { success: false, message: "Missing programId, day or month" },
      { status: 400 }
    );
  }
  console.log("Query params:", { programId, day, month });

  try {
    const { data: trainingDays, error } = await supabase
      .from("training_days")
      .select("id")
      .eq("training_program_id", programId)
      .eq("month_number", month)
      .eq("day_number", day)
      .maybeSingle();
    if (error) throw error;

    if (!trainingDays || !trainingDays.id) {
      console.warn("❌ Ingen training_day hittades för dessa parametrar:", {
        programId,
        day,
        month,
      });
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // const trainingDay = trainingDays[0];

    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("*")
      .eq("training_day_id", trainingDays.id)
      .order("index_order", { ascending: true });
    console.log("Exercises found:", exercises);

    // if (!exercises || exercises.length === 0) {
    //   return Response.json({ success: true, data: [] });
    // }

    if (exercisesError) {
      return NextResponse.json(
        {
          success: false,
          error: "Fel vid hämtning av exercises",
          details: exercisesError.message,
        },
        { status: 500 }
      );
    }
    // { success: true, trainingDay: day[0], data: exercises },
    return NextResponse.json(
      { success: true, data: exercises },
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
