import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  const supabase = createClient();

  try {
    const body = await req.json();
    const { exercises } = body;
    console.log("✅ API mottog data:", exercises);
    console.log("📦 RAW body:", body);
    console.log("📦 Fullständig body:", JSON.stringify(body, null, 2));


    if (!body || !Array.isArray(body.exercises)) {
      console.error("❌ Felaktig request body:", body);
      return new Response(
        JSON.stringify({
          error: "'exercises' måste vara en array i ett objekt",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const errors = [];
    const successes = [];

    const updates = await Promise.allSettled(
      exercises.map(async ({ id, index_order }) => {
        if (!id || typeof index_order !== "number") {
          errors.push({ id, message: "Saknar giltigt id eller index_order" });
          return;
        }
        const { error } = await supabase
          .from("exercises")
          .update({ index_order })
          .eq("id", id);

        if (error) {
          console.error(`❌ Fel vid uppdatering av ${id}:`, error.message);
          errors.push({ id, message: error.message });
        } else {
          successes.push(id);
        }
      })
    );

    console.log("🛠️ Supabase updates:", updates);

    console.log("✅ Uppdaterade övningar:", successes);
    if (errors.length > 0) {
      console.warn("⚠️ Fel vid vissa uppdateringar:", errors);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Vissa övningar kunde inte uppdateras.",
          errors,
        }),
        { status: 207, headers: { "Content-Type": "application/json" } } // 207 = Multi-Status
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Serverfel vid hantering av POST:", error);
    return new Response(JSON.stringify({ error: "Serverfel" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  //   for (const ex of exercises) {
  //     if (!ex.id || typeof ex.index_order !== "number") {
  //       return new Response(
  //         JSON.stringify({ error: "Fel i ett övningsobjekt" }),
  //         { status: 400 }
  //       );
  //     }
  //   }

  //   return new Response(JSON.stringify({ success: true }), {
  //     status: 200,
  //     headers: { "Content-Type": "application/json" },
  //   });
  // } catch (error) {
  //   console.error("❌ Serverfel vid hantering av POST:", error);
  //   return new Response("Serverfel", { status: 500 });
  // }
}
