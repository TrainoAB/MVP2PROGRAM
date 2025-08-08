import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  return new NextResponse("API-rutten fungerar!");
}

export async function PUT(request, { params }) {
  const supabase = createClient();
  const { id } = params;
  const updatedData = await request.json();

  console.log("Uppdaterar övning med id:", id);
  console.log("Data som ska uppdateras:", updatedData);
  try {
    const { data, error } = await supabase
      .from("exercises")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Övning ${id} uppdaterad.` },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
