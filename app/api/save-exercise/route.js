import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      training_program_id,
      title,
      duration,
      description,
      month_number,
      day_number,
      day_image_url,
      day_video_url,
      exercise_image_url,
      exercise_video_url,
      index_order,
    } = body;

    if (!training_program_id) {
      return NextResponse.json(
        { error: "training_program_id krävs" },
        { status: 400 }
      );
    }

    if (!month_number || !day_number) {
      return NextResponse.json(
        { error: "Månad och dag krävs" },
        { status: 400 }
      );
    }

    const parsedIndexOrder = parseInt(index_order, 10) || 0;
    const supabase = await createClient();

    // 🔁 Steg 1: Skapa eller hitta rätt training_day
    const { data: trainingDay, error: dayError } = await supabase
      .from("training_days")
      .upsert(
        {
          training_program_id,
          month_number,
          day_number,
          image_url: day_image_url,
          video_url: day_video_url,
        },
        { onConflict: "training_program_id,month_number,day_number" }
      ) // 👈 undvik dubletter
      .select()
      .single();

    console.log("trainingDayData:", trainingDay);
    console.log("dayError:", dayError);

    if (dayError) {
      console.error("❌ Fel vid upsert av training_day:", dayError);
      return res.status(500).json({ error: "Kunde inte spara training_days" });
    }

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      return NextResponse.json(
        { error: "Duration måste vara ett positivt heltal" },
        { status: 400 }
      );
    }

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Titel krävs" }, { status: 400 });
    }

    // 4. Skapa övning kopplad till training_day
    const { data: insertedExercise, error: insertExerciseError } =
      await supabase
        .from("exercises")
        .insert([
          {
            training_day_id: trainingDay.id,
            image_url: exercise_image_url,
            video_url: exercise_video_url,
            duration: parsedDuration,
            title,
            description,
            index_order: parsedIndexOrder,
          },
        ])
        .select()
        .single();

    if (insertExerciseError) {
      return NextResponse.json(
        {
          error: "Kunde inte spara övning",
          details: insertExerciseError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, trainingDay, exercise: insertedExercise },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Serverkrasch", details: error.message },
      { status: 500 }
    );
  }
}
