import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase";

export async function GET(req) {
  console.log("Method:", req.method);
  const searchParams = req.nextUrl.searchParams;

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
      .eq("day_number", Number(day))
      .eq("month_number", Number(month))

      if (error) throw error;
      if (!trainingDays || trainingDays.length === 0) {
        return NextResponse.json(
          { success: false, message: "Training day not found" },
          { status: 404 }
        );
    }

    if (res.status === 404) {
      console.log("Training day finns inte ännu. Väntar.");
      return;
    }

    const trainingDay = trainingDays[0];

    const { data: exercises, error: exercisesError } = await supabase
      .from("exercises")
      .select("*")
      .eq("training_day_id", trainingDay.id)
      .order("index_order", { ascending: true });
    
      if (exercisesError) throw exercisesError;
    
    return NextResponse.json(
      { success: true, data: exercises },
      { status: 200 }
    );
  } catch (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
