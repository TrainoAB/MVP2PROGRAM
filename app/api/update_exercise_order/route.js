import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = createClient();

  try {
    // const body = await req.json();
    // const { exercises } = body;
    const { exercises } = await req.json();
    console.log("📦 Inkommande req.json(): body", body);
    console.log("✅ API mottog data:", exercises);

    if (!Array.isArray(exercises)) {
      return new Response(
        JSON.stringify({ error: "'exercises' måste vara en array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // const updatePromises = exercises.map(({ id, index_order }) => {
    //   if (!id || index_order === undefined) {
    //     throw new Error(
    //       `Saknar id eller index_order i: ${JSON.stringify({
    //         id,
    //         index_order,
    //       })}`
    //     );
    //   }
    //   return supabase.from("exercises").update({ index_order }).eq("id", id);
    // });

    // const results = await Promise.all(updatePromises);

    // for (let i = 0; i < results.length; i++) {
    //   const { error } = results[i];
    //   if (error) {
    //     console.error(
    //       `❌ Fel vid uppdatering av övning ${exercises[i].id}:`,
    //       error.message
    //     );
    //     return new Response(`Fel vid uppdatering: ${error.message}`, {
    //       status: 500,
    //     });
    //   }
    // }
    const updates = await Promise.all(
      exercises.map(({ id, index_order }) =>
        supabase.from("exercises").update({ index_order }).eq("id", id)
      )
    );

    for (const ex of exercises) {
      if (!ex.id || typeof ex.index_order !== "number") {
        return new Response(
          JSON.stringify({ error: "Fel i ett övningsobjekt" }),
          { status: 400 }
        );
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Serverfel vid hantering av POST:", error);
    return new Response("Serverfel", { status: 500 });
  }
}
