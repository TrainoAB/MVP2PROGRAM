import { createServerClient } from "@/utils/supabase/server"; // du definierar denna fil (se nedan)
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createServerClient(); // server-klienten med env vars
  const { updatedExercises } = await req.json();

  for (const exercise of updatedExercises) {
    const { error } = await supabase
      .from("exercises")
      .update({ index_order: exercise.index_order })
      .eq("id", exercise.id);

    if (error) {
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
