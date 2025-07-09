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

export function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const regex = /(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?/]+)/;
  const match = url.match(regex);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}
