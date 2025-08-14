import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
    try {
      const { exercise_id, content } = await req.json();
        
if (!exercise_id || !content) {
  return NextResponse.json(
    { error: "exerciseId and content are required" },
    { status: 400 }
  );
}

      const supabase = await createClient();

      const { data, error } = await supabase
        .from("exercise_notes")
        .upsert(
          {
            exercise_id,
            content,
          },
          { onConflict: ["exercise_id"] }
        )
        .select()
        .single();
        
        
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Serverkrasch", details: error.message },
            { status: 500 }
        );
    }
}