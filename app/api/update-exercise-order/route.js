import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = createClient();

  const body = await req.json();

  const exercises = body.updatedExercises;

  if (!Array.isArray(exercises)) {
    return new Response("Ogiltig data", { status: 400 });
  }

  for (let i = 0; i < exercises.length; i++) {
    const { id, index_order } = exercises[i];

    if (!id || index_order === undefined) {
      return new Response("Saknar id eller index_order", { status: 400 });
    }

    const { error } = await supabase
      .from("exercises")
      .update({ index_order })
      .eq("id", id);

    if (error) {
      console.error(`Uppdateringsfel för id ${id}:`, error.message);
      return new Response("Fel vid uppdatering", { status: 500 });
    }
  }
}
