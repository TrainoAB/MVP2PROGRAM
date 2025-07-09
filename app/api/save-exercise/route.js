import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      training_program_id,
      month_number,
      day_number,
      day_image_url,
      day_video_url,
      exercise_image_url,
      exercise_video_url,
      duration,
      title,
      description,
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

    // 1. Försök hitta befintlig training_day
    let { data: dayRows, error: selectDayError } = await supabase
      .from("training_days")
      .select("*")
      .eq("month_number", month_number)
      .eq("day_number", day_number);

    if (selectDayError) {
      return NextResponse.json(
        {
          error: "Tekniskt fel vid hämtning av training_day",
          details: selectDayError.message,
        },
        { status: 500 }
      );
    }
    // Inget fel = vi fortsätter. Det är normalt om dayRows är tomt.
    let trainingDay;

    // 2. Om ingen finns, skapa ny
    if (!dayRows || dayRows.length === 0) {
      const { data: newDay, error: insertDayError } = await supabase
        .from("training_days")
        .insert([
          {
            training_program_id,
            month_number,
            day_number,
            image_url: day_image_url,
            video_url: day_video_url,
          },
        ])
        .select()
        .single();

      if (insertDayError || !newDay) {
        return NextResponse.json(
          {
            error: "Kunde inte skapa training_day",
            details: insertDayError?.message,
          },
          { status: 500 }
        );
      }

      trainingDay = newDay;
    } else {
      // 3. Om en redan finns, uppdatera ev. bild/video om de skickas med
      trainingDay = dayRows[0];

      if (day_image_url || day_video_url) {
        await supabase
          .from("training_days")
          .update({
            ...(day_image_url && { image_url: day_image_url }),
            ...(day_video_url && { video_url: day_video_url }),
          })
          .eq("id", trainingDay.id);
      }
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
