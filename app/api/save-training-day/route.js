import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  console.log("Request body:", req.body);
  try {
    const body = await req.json();
    const { month_number, day_number, image_url, video_url } = body;

    if (!month_number || !day_number) {
      return NextResponse.json(
        { error: "Månad och dag krävs" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    console.log("Supabase:", supabase);
    console.log("from är funktion?:", typeof supabase?.from);

    const { data: program, error: programError } = await supabase
      .from("training_programs")
      .select("id")
      .order("inserted_at", { ascending: false })
      .limit(1)
      .single();

    if (programError) {
      console.error("Insert error:", programError);
      return NextResponse.json(
        { error: "Kunde inte spara", details: programError.message },
        { status: 500 }
      );
    }

    const { data, dayError } = await supabase
      .from("training_days")
      .insert([
        {
          training_program_id: program.id,
          month_number,
          day_number,
          image_url,
          video_url,
        },
      ])
      .select();

    if (dayError) {
      return NextResponse.json(
        { error: "Kunde inte spara", details: dayError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
