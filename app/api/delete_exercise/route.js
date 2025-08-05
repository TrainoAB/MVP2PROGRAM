import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get("exerciseId");


  if (!exerciseId) {
    return NextResponse.json(
      { success: false, message: "exerciseId krävs." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId);

  if (error) {
    console.error("Fel vid radering av övning:", error.message);
    return NextResponse.json(
      { success: false, message: "Kunde inte radera övning." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 200 });
}