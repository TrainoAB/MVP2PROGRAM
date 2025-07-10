export function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : "";
}

export function getImageOrVideoIfSavedToday() {

  const saved = localStorage.getItem("training");
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    const savedDate = parsed.savedDate?.slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);

    if (savedDate === today) {
      return {
        name: parsed.name || "Träningsvideo/bild",
        videoUrl: parsed.videoUrl || null,
        imageUrl: parsed.imageUrl || null,
      };
    } else {
      // localStorage.removeItem("training");
      return null;
    }
  } catch (e) {
    console.error("Kunde inte parsa training från localStorage:", e);
    return null;
  }
}

export async function moveExercises(direction, exercises, setExercises, supabase) {
  const sorted = [...exercises].sort((a, b) => a.index_order - b.index_order);

  const newOrder =
    direction === "asc"
      ? sorted.sort((a, b) => a.index_order - b.index_order)
      : sorted.sort((a, b) => b.index_order - a.index_order);

  // Uppdatera index_order
  const updated = newOrder.map((exercise, index) => ({
    ...exercise,
    index_order: index + 1,
  }));

  setExercises(updated);

  const updates = await Promise.all(
    updated.map((exercise) =>
      supabase
        .from("exercises")
        .update({ index_order: exercise.index_order })
        .eq("id", exercise.id)
    )
  );

  const hasError = updates.some((res) => res.error);

  if (hasError) {
    console.error("Något gick fel vid uppdatering av index_order.");
    // Här kan du också återställa till tidigare state om du vill
  }
}