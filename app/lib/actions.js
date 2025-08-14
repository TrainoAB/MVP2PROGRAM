export async function saveTrainingProgram({
  description,
  price,
  days,
  training,
}) {
  if (!description) return console.error("Beskrivning saknas!");
  if (!price) return console.error("Pris saknas!");
  if (!days) return console.error("Antal dagar saknas!");

  console.log("Beskrivning:", description);
  console.log("Pris:", price, "->", Number(price));
  console.log("Dagar:", days);
  console.log("Bild-URL:", training.imageUrl);
  console.log("Video-URL:", training.videoUrl);
  console.log("Tränar-ID:", training.trainerId);

  const res = await fetch("/api/training_program", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description,
      price: Number(price),
      days,
      imageUrl: training.imageUrl,
      videoUrl: training.videoUrl,
      trainerId: training.trainerId,
    }),
  });

  console.log("Response status:", res.status);
  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Servern returnerade inte JSON:", text);
    throw new Error("Ogiltigt svar från servern (ej JSON)");
  }

  const data = await res.json();
  console.log("Response data:", data);

  if (!res.ok) {
    throw new Error(data.message || "Något gick fel");
  }
  return data;
}

export async function saveExercise({
  training_program_id,
  title,
  duration,
  description,
  dayImageUrl,
  videoUrl,
  dayVideoUrl,
  imageUrl,
  index_order,
  month_number,
  day_number,
}) {
  const response = await fetch("/api/save-exercise", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      training_program_id,
      month_number,
      day_number,
      title,
      duration,
      description,
      day_image_url: dayImageUrl ?? null,
      day_video_url: dayVideoUrl ?? null,
      exercise_image_url: imageUrl ?? null,
      exercise_video_url: videoUrl ?? null,
      index_order,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error("Felstatus:", response.status, "Svar:", responseText);
    throw new Error("Sparningen misslyckades");
  }
  const body = await response.json();
  console.log("🧾 Body innehåller:", body);
  return body;
}

export async function getExercisesByDay(programId, month, day) {
  const response = await fetch(
    `/api/get-exercises?programId=${programId}&month=${month}&day=${day}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fel vid hämtning av övningar: ${errorText}`);
  }

  return await response.json(); // förväntar att API:et returnerar exercises som JSON
}

/**
 * @param {Array<{id: string, index_order: number}>} exercises
 */

export async function getDescription(programId) {
  const res = await fetch(`/api/get_description?programId=${programId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  let json;
  try {
    json = await res.json();

    if (!json.success) {
      throw new Error(json.message || "Okänt API-fel");
    }

    return {
      description: json.description,
      image_url: json.image_url,
      video_url: json.video_url,
    };
  } catch (error) {
    console.error("Fel vid tolkning av JSON:", error);
    throw new Error("Kunde inte parsa JSON från API-svaret");
  }
}

export async function fetchExercises({ month, day, programId }) {

  console.log("📦 fetchExercises kallad med:", { month, day, programId });
  if (!month || !day || !programId) {
    console.error("❌ fetchExercises: saknar parametrar", {
      month,
      day,
      programId,
    });
    return {
      success: false,
      message: "Alla parametrar (month, day, programId) krävs",
      data: [],
    };
  }

  try {
    console.log(`month=${month}&day=${day}&programId=${programId}`);
    const url = `/api/get-exercises?month=${month}&day=${day}&programId=${programId}`;
    console.log("🌍 Hämtar från URL:", url);

    const res = await fetch(url);

    if (!res.ok) {
       if (res.status === 500) {
         console.warn("ℹ️  Inga övningar eller internserverfel (500).");
         return { success: false, data: [], message: "Inga övningar" };
       } else {
            console.error("❌ API-svar var inte OK", res.status);
            return {
              success: false,
              data: [],
              message: `Status: ${res.status}`,
            };
      };
    }
    const data = await res.json();

    console.log("📥 fetchExercises fick svar:", data);

    return data;
  } catch (err) {
    console.error("❌ fetchExercises: fel vid fetch:", err);
    return {
      success: false,
      message: err.message || "Något gick fel vid hämtning",
      data: [],
    };
  }
}

export async function fetchDayMedia({ programId, day, month, setDayMedia })
{
    const res = await fetch(
      `/api/get-training-day?programId=${programId}&day=${day}&month=${month}`
    );
    const result = await res.json();

    if (result.success) {
      setDayMedia({
        image: result.data.cover_image_url,
        video: result.data.cover_video_url,
      });
    }
}


export async function deleteExercise(exerciseId) {
  try {
    const response = await fetch(
      `/api/delete_exercise?exerciseId=${exerciseId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fel vid radering av övning:", errorText);
      throw new Error(`Radering misslyckades: ${errorText}`);
    }

    const result = await response.json();
    console.log("Övning raderad:", result);
    return result;
  } catch (error) {
    console.error("Fel vid deleteExercise:", error);
    throw error;
  }
}

export async function updateExercise(exerciseId, updatedData) {
  try {
    const response = await fetch(`/api/update_exercise/${exerciseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fel vid uppdatering av övning:", errorText);
      throw new Error(`Uppdatering misslyckades: ${errorText}`);
    }

    const result = await response.json();
    console.log("Övning uppdaterad:", result);
    return result;
  } catch (error) {
    console.error("Fel vid updateExercise:", error);
    throw error;
  }
}

export async function addExerciseNotes( exerciseId, content ) {
    console.log("Skickar till API:", { exerciseId, content });
  try {
    const response = await fetch(`/api/add_exercise_notes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ exercise_id: exerciseId, content: content }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fel vid tillägg av övningsanteckningar:", errorText);
      throw new Error(`Tillägg misslyckades: ${errorText}`);
    }

    const result = await response.json();
    console.log("Övningsanteckningar tillagda:", result);
    return result;
  } catch (error) {
    console.error("Fel vid addExerciseNotes:", error);
    throw error;
  }
}

export async function fetchExerciseNotes(exerciseId) {
  try {
    const response = await fetch(`/api/get_exercise_notes?exercise_id=${encodeURIComponent(exerciseId)}`
      , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Fel vid hämtning av övningsanteckningar:", errorText);
      throw new Error(`Hämtning misslyckades: ${errorText}`);
    }

    const data = await response.json();
    console.log("Övningsanteckningar hämtade:", data);
    return data;
  } catch (error) {
    console.error("Fel vid fetchExerciseNotes:", error);
    throw error;
  }
}
