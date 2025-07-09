"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Plus } from "lucide-react";

import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { extractYouTubeId } from "@/app/functions/functions";
import AddExerciseModal from "@/app/components/Add_Exercise_Modal/AddExerciseModal";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { month, day } = params;
  console.log("params", params);
  const programId = searchParams.get("programId");
  console.log("programId", programId);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const openModalExercise = () => setIsExerciseModalOpen(true);
  const closeModalExercise = () => setIsExerciseModalOpen(false);

  const [dayMedia, setDayMedia] = useState({
    imageUrl: "",
    videoUrl: "",
    savedDate: new Date().toISOString(),
  });

  const [exercises, setExercises] = useState([]);
  console.log("Params som skickas:", { programId, month, day });


  const fetchExercises = async () => {
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
      setExercises(data);
    } catch (err) {
      console.error("Fel vid hämtning av övningar:", err);
    }
  };

  useEffect(() => {
    if (!programId || !day || !month) return;
    fetchExercises();
  }, [month, day, programId]);

  const setDayMediaWrapper = (newMedia) => {
    if (newMedia.videoUrl) {
      const videoId = extractYouTubeId(newMedia.videoUrl);
      newMedia.videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      console.log("Embed URL:", newMedia.videoUrl);
    }
    setDayMedia(
      newMedia.videoUrl ? newMedia : { ...newMedia, videoUrl: "" }
    );
  };

  return (
    <div className={styles.trainingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
        ></button>
        <h1 className={styles.title}>Skapa träningsprogram</h1>
        <h3 className={styles.mounthDay}>
          Månad {month} / Dag {day}
        </h3>
      </header>
      <UploadYoutubeVideoModal
        isVideoModalOpen={isVideoModalOpen}
        closeModalVideo={closeModalVideo}
        setTraining={setDayMediaWrapper}
      ></UploadYoutubeVideoModal>
      <UploadImageModal
        isImageModalOpen={isImageModalOpen}
        closeModalImg={closeModalImg}
        setTraining={setDayMedia}
      ></UploadImageModal>
      {isExerciseModalOpen && (
        <div className="modal">
          <AddExerciseModal
            isExerciseModalOpen={isExerciseModalOpen}
            closeModalExercise={closeModalExercise}
            onExerciseAdded={fetchExercises}
            trainingProgramId={programId}
            dayImageUrl={dayMedia.imageUrl}
            dayVideoUrl={dayMedia.videoUrl}
            month={month}
            day={day}
          ></AddExerciseModal>
        </div>
      )}
      <main className={styles.main}>
        {dayMedia.videoUrl &&
        (dayMedia.videoUrl.includes("youtube.com") ||
          dayMedia.videoUrl.includes("youtu.be")) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={dayMedia.videoUrl}
              title="YouTube video player"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : dayMedia.imageUrl ? (
          <Image
            src={dayMedia.imageUrl}
            alt="Tränarens bild"
            width={500}
            height={500}
            className={styles.fallbackImage}
          />
        ) : null}
        <p className={styles.imageLoadTitle}>Omslag</p>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={openModalImg}
            className={styles.chooseImageButton}
          >
            Välj bild
          </button>
          <button
            type="button"
            onClick={openModalVideo}
            className={styles.openBtn}
          >
            Välj Video
          </button>
        </div>
        <div className={styles.buttonWrapper}>
          <div className={styles.buttonContainerExercise}>
            <label htmlFor="exercise-button" className={styles.buttonLabel}>
              Lägg till övning
            </label>
            <button
              id="exercise-button"
              type="button"
              aria-label="Lägg till övning"
              onClick={openModalExercise}
              className={styles.openBtnExercise}
            >
              {/* Lägg till övning */}
              <Plus size={24} />
            </button>
          </div>
        </div>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Dagens övningar</h2>
          {exercises.length === 0 ? (
            <p className={styles.noExercises}>Inga övningar tillagda än.</p>
          ) : (
            <ul className={styles.exerciseList}>
              {exercises.map((exercise, index) => (
                <li key={exercise.id ?? index} className={styles.exerciseCard}>
                  <h3 className={styles.exerciseTitle}>{exercise.title}</h3>
                  <p className={styles.exerciseDescription}>
                    {exercise.description}
                  </p>
                  <p className={styles.exerciseDuration}>
                    Varaktighet: {exercise.duration} minuter
                  </p>
                  {exercise.image_url && (
                    <img
                      src={exercise.image_url}
                      alt={exercise.title}
                      className={styles.exerciseImage}
                    />
                  )}
                  {exercise.video_url &&
                  (exercise.video_url.includes("youtube.com") ||
                    exercise.video_Url.includes("youtu.be")) ? (
                    <div className={styles.videoWrapper}>
                      <iframe
                        src={exercise.video_url}
                        title="YouTube video player"
                        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : null}
                  <div className={styles.buttonWrapper}>
                    <button className={styles.deleteButton} onClick={() => {}}>
                      Ta bort
                    </button>
                    <button
                      className={styles.completeButton}
                      onClick={() => {}}
                    >
                      Kompletera
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
