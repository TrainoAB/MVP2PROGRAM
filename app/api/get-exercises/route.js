import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req) {
  const supabase = await createClient();
  console.log("🔍 In API: /api/get-exercises");
  console.log("Method:", req.method);
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const programId = searchParams.get("programId");
  const day = searchParams.get("day");
  const month = searchParams.get("month");
  console.log("Parsed params:", { programId, day, month });

  if (!programId || !day || !month) {
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
      .eq("month_number", Number(month))
      .eq("day_number", Number(day));

    if (error) throw error;
    if (!trainingDays || trainingDays.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 202 });
    }

    const trainingDay = trainingDays[0];

    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("*")
      .eq("training_day_id", trainingDay.id)
      .order("index_order", { ascending: true });
    console.log("Exercises found:", exercises);
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
