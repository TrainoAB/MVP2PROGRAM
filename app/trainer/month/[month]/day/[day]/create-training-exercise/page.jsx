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
  
  const [trainingDaySaved, setTrainingDaySaved] = useState(false);

  const [exercise, setExercise] = useState({
    name: "Övningssvideo1",
    videoUrl: null,
    imageUrl: null,
    savedDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (!trainingDaySaved) return;
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
        const data = await res.json();
      } catch (err) {
        console.error("Fel vid hämtning av övningar:", err);
      }
    };

    fetchExercises();
  }, [trainingDaySaved]);

  const setExerciseWrapper = (newExercise) => {
    if (newExercise.videoUrl) {
      const videoId = extractYouTubeId(newExercise.videoUrl);
      newExercise.videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      console.log("Embed URL:", newExercise.videoUrl);
    }
    setExercise(
      newExercise.videoUrl ? newExercise : { ...newExercise, videoUrl: "" }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      month_number: parseInt(month),
      day_number: parseInt(day),
      image_url: exercise.imageUrl,
      video_url: exercise.videoUrl,
    };

    console.log("Skickar följande data till servern:", payload);

    try {
      const res = await fetch("/api/save-training-day", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Fel från API:", res.status);
        throw new Error("Server error");
      }

      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          alert(data.success); // Visa meddelande
          setTrainingDaySaved(true);
        } else {
          console.error("Något gick fel:", data.message);
        }
      } else {
        const text = await res.text();
        console.warn("Ingen JSON i svaret:", text);
      }
    } catch (err) {
      console.error("Något gick fel:", err);
    }
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
        setTraining={setExerciseWrapper}
      ></UploadYoutubeVideoModal>
      <UploadImageModal
        isImageModalOpen={isImageModalOpen}
        closeModalImg={closeModalImg}
        setTraining={setExercise}
      ></UploadImageModal>
      {isExerciseModalOpen && (
        <div className="modal">
          <AddExerciseModal
            isExerciseModalOpen={isExerciseModalOpen}
            closeModalExercise={closeModalExercise}
            month={month}
            day={day}
          ></AddExerciseModal>
        </div>
      )}
      <main className={styles.main}>
        {exercise.videoUrl &&
        (exercise.videoUrl.includes("youtube.com") ||
          exercise.videoUrl.includes("youtu.be")) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={exercise.videoUrl}
              title="YouTube video player"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : exercise.imageUrl ? (
          <Image
            src={exercise.imageUrl}
            alt="Tränarens bild"
            width={500}
            height={500}
            className={styles.fallbackImage}
          />
        ) : null}
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <button type="submit" className={styles.saveButton}>
              Spara dag
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
        </form>

      </main>
    </div>
  );
}


