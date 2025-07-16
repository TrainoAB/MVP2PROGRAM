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
  videoUrl,
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
      title,
      duration,
      description,
      video_url: videoUrl,
      image_url: imageUrl,
      index_order,
      month_number,
      day_number,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error("Felstatus:", response.status, "Svar:", responseText);
    throw new Error(`Fel vid sparande av övning: ${responseText}`);
  }
  const body = await response.json();
  console.log("🧾 Body innehåller:", body);
  return response.json();
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
    const url = `/api/get-exercises?month=${month}&day=${day}&programId=${programId}`;
    console.log("🌍 Hämtar från URL:", url);

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ API-svar var inte OK", res.status);
      return {
        success: false,
        message: `API-svar: ${res.status}`,
        data: [],
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
