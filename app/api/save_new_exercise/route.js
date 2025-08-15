import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });
  const exercise = await req.json();

  try {
    let result;

    if (exercise.id) {
      // Uppdatera befintlig övning
      const { data, error } = await supabase
        .from("exercises")
        .update({
          title: exercise.title,
          imageUrl: exercise.imageUrl,
          videoUrl: exercise.videoUrl,
          duration: exercise.duration,
          description: exercise.description,
          notes: exercise.notes,
        })
        .eq("id", exercise.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Skapa ny övning
      const { data, error } = await supabase
        .from("exercises")
        .insert([
          {
            title: exercise.title,
            imageUrl: exercise.imageUrl,
            videoUrl: exercise.videoUrl,
            duration: exercise.duration,
            description: exercise.description,
            notes: exercise.notes,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}