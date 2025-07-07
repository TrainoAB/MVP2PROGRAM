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

    let { data: day, error: selectDayError } = await supabase
      .from("training_days")
      .select("id")
      .eq("month_number", month_number)
      .eq("day_number", day_number)
  
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

    if (!day || day.length === 0) {
      // Skapa ny training_day här
    } else if (day.length > 1) {
      return NextResponse.json(
        { error: "Flera training_days hittades – förväntade en." },
        { status: 500 }
      );
    } else {
      day = day[0];
      // Använd day.id vidare här
    }

    if (!day) {
      console.log("Ingen training_day hittades – skapar ny...");
      const { data: newDay, error: insertDayError } = await supabase
        .from("training_days")
        .insert([{ month_number, day_number, image_url, video_url }])
        .select()
        .single();

      if (insertDayError || !newDay) {
        console.error("Fel vid skapande av training_day:", insertDayError);
        return NextResponse.json(
          {
            error: "Kunde inte skapa ny träningsdag",
            details: insertDayError?.message,
          },
          { status: 500 }
        );
      }

      day = newDay; // uppdatera med den nyss skapade raden
      console.log("Ny training_day skapad:", day);
    }

    if (!day) {
      return NextResponse.json(
        { error: "Ingen training_day hittades för angiven månad och dag" },
        { status: 404 }
      );
    }

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
    return NextResponse.json(
      { error: "Serverkrasch", details: error.message },
      { status: 500 }
    );
  }
}
