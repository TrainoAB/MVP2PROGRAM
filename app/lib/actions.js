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
    throw new Error(`Fel vid sparande av övning: ${errorText}`);
  }

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
export async function updateExerciseOrder(exercises) {
  const response = await fetch("/api/update-exercise-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exercises }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Fel vid uppdatering av ordning: ${message}`);
  }

  return await response.text();
}

export async function getDescription(programId) {
  const res = await fetch(
    `/api/get_description_img_video?programId=${programId}`
  );
  let json;
  try {
    json = await res.json();
  } catch (error) {
    console.error("Fel vid tolkning av JSON:", error);
    throw new Error("Kunde inte parsa JSON från API-svaret");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Kunde inte hämta data");
  }

  return json;
}

export async function fetchExercises(param) {
  if (!param) {
    console.error("fetchExercises anropades utan parameter");
    throw new Error("fetchExercises requires { month, day, programId }");
  }

  const { month, day, programId } = param;

  if (!month || !day || !programId) {
    throw new Error("Alla parametrar (month, day, programId) krävs");
  }

  try {
    const res = await fetch(
      `/api/get-exercises?month=${month}&day=${day}&programId=${programId}`
    );
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const text = await res.text();
      console.error("Fel från API:", res.status, text);
      throw new Error(`API-fel: ${res.status}`);
    }
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Ogiltigt innehåll från API:", text);
      throw new Error("API returnerade inte JSON");
    }

    const { success, data, message } = await res.json();

    if (!success) {
      console.error("API svarade med success=false:", message);
      throw new Error(message || "Okänt API-fel");
    }
    console.log("Övningar hämtade:", data);
    console.log("month", month, "day", day, "programId", programId);
    return { success: true, data };
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
}
