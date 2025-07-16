import { supabase } from "@/utils/supabase/client";

export function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : "";
}

export function rearrangeExercises(exercises) {
  if (!Array.isArray(exercises)) {
    console.error(
      "❌ rearrangeExercises: 'exercises' är inte en array:",
      exercises
    );
    return [];
  }
  return [...exercises].sort((a, b) => a.index_order - b.index_order);
}

export function sortByIndexOrder(exercises, direction = "asc") {
  return [...exercises].sort((a, b) =>
    direction === "asc"
      ? a.index_order - b.index_order
      : b.index_order - a.index_order
  );
}

async function updateExerciseOrderApi(exercises) {
  console.log("📦 Skickar denna data till API:", exercises);

  const res = await fetch("/api/update-exercise-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercises }),
  });

  if (!res.ok) {
    let errorMessage = `Status: ${res.status}`;
    try {
      const errorData = await res.json();
      console.error("❌ Fel från API:", errorData);
      errorMessage += ` | ${errorData?.error || "Okänt fel"}`;
    } catch (e) {
      throw new Error(errorMessage);
    }

    return await res.json();
  }
}

export async function moveExercises(direction, exercises, setExercises) {
  console.log("📦 Skickar till API:", exercises);

  if (!["asc", "desc"].includes(direction)) {
    console.error("❌ moveExercises: Ogiltig sorteringsriktning:", direction);
    return;
  }

  const isSetExercisesValid = typeof setExercises === "function";

  if (!Array.isArray(exercises)) {
    console.error("❌ moveExercises: 'exercises' är inte en array:", exercises);
    if (isSetExercisesValid) setExercises([]);
    return;
  }

  const sorted = sortByIndexOrder(exercises, direction);

  const updated = sorted.map((exercise, index) => ({
    id: exercise.id,
    index_order: index + 1,
  }));

console.log(
  "📤 Skickar detta till updateExerciseOrderApi:",
  JSON.stringify(updated, null, 2)
);
  try {
    await updateExerciseOrderApi(updated);

    if (isSetExercisesValid) {
      setExercises(updated);
    }
  } catch (error) {
    console.error(
      "❌ moveExercises: Något gick fel vid API-anropet:",
      error.message
    );
  }
}
