import { createServerClient } from "@/utils/supabase/supabaseClient";

export async function POST(req) {
  const supabase = createServerClient();

  try {
    const body = await req.json();
    const { exercises } = body;

    console.log("✅ API mottog data:", exercises);
    console.log("📦 Inkommande body:", body);

    if (!Array.isArray(exercises)) {
      return new Response(
        JSON.stringify({
          error: "'exercises' måste vara en array",
          debug: body,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
      return new Response(
        JSON.stringify({
          success: false,
          message: "Vissa övningar kunde inte uppdateras.",
          errors,
        }),
        {
          status: 207, // Multi-Status (blandad framgång)
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ success: true, updated: successes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Serverfel vid hantering av POST:", error);

    return new Response(
      JSON.stringify({ error: "Serverfel", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
