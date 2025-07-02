import { db } from "@/utils/supabase/server";

export async function POST(req) {
    try {
      const body = await req.json();

      const exercises = body.exercises;

      if (!Array.isArray(exercises)) {
        return new Response("Ogiltig data", { status: 400 });
      }

      for (let i = 0; i < exercises.length; i++) {
        const { id, index_order } = exercises[i];

        if (!id || index_order === undefined) {
          return new Response("Saknar id eller index_order", { status: 400 });
        }

        await db.exercises.update({
          where: { id },
          data: { index_order },
        });
      }

      return new Response("Ordning uppdaterad", { status: 200 });
    } catch (error) {
      console.error("Fel vid uppdatering:", error);
      return new Response("Serverfel", { status: 500 });
    }
}
