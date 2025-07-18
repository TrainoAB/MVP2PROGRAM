import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Mottaget:", body);

    const { description, price, days, imageUrl, videoUrl, trainerId } = body;

    if (!description || !price || !days) {
      return NextResponse.json(
        { error: "Saknar obligatoriska fält" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("training_programs")
      .insert([
        {
          description,
          price,
          days,
          image_url: imageUrl,
          video_url: videoUrl,
          trainer_id: trainerId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Kunde inte skapa träningsprogram" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { message: "Training program sparat" },
      { status: 201 }
    );
    // return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("API-fel:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
