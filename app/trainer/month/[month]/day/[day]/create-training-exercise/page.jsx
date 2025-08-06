"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ExerciseEditorView from "@/app/components/Editor/ExerciseEditorView";
import {
  rearrangeExercises,
  updateExerciseOrderApi,
} from "@/app/functions/functions";
import { Plus } from "lucide-react";
import { fetchExercises } from "@/app/lib/actions";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { extractYouTubeId } from "@/app/functions/functions";
import AddExerciseModal from "@/app/components/Add_Exercise_Modal/AddExerciseModal";
import { deleteExercise } from "@/app/lib/actions";
import ConfirmDialog from "@/app/components/ConfirmDialog/ConfirmDialog";
import ExerciseCard from "@/app/components/ExerciseCard/ExerciseCard";
import DayMedia from "@/app/components/DayMedia/DayMedia";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { month, day } = params;
  const programId = searchParams.get("programId");

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

  const [step, setStep] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loadingExercises, setLoadingExercises] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);

  const fetchDay = async () => {
    try {
      const res = await fetch(
        `/api/get_day_image_video?month=${month}&day=${day}&programId=${programId}`
      );
      const contentType = res.headers.get("content-type");

      let responseData;
      if (contentType?.includes("application/json")) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      if (!res.ok) {
        console.error("HTTP-fel vid hämtning:", responseData);
        throw new Error("HTTP error");
      }

      const { success, message, data } = responseData;

      if (!success) {
        console.error("API svarade med success=false:", message);
        throw new Error(message || "Okänt API-fel");
      }

      console.log("dag hämtad:", data);
      console.log("month", month, "day", day, "programId", programId);

      setDayMedia({
        imageUrl: data.image_url || "",
        videoUrl: data.video_url || "",
        savedDate: data.inserted_at || new Date().toISOString(),
      });
      setDayMediaWrapper(data);
      return { success: true, data };
    } catch (err) {
      console.error("Fel vid hämtning av dag:", err);
    }
  };

  const fetchExercisesData = async () => {
    setLoadingExercises(true);

    try {
      const result = await fetchExercises({
        month,
        day,
        programId,
      });

      if (!result.success && result.message === "Inga övningar") {
        console.warn("ℹ️ Inga övningar ännu.");
        setExercises([]); // eller tomt initialt värde
        return;
      }

      if (!result.success) {
        console.error("❌ Fel från API:", result.message || result.error);
        throw new Error("API-svaret innehåller ett fel.");
      }

      if (!Array.isArray(result.data)) {
        console.error("❌ result.data är inte en array:", result.data);
        if (typeof setExercises === "function") {
          setExercises([]);
        }
        return;
      }

      if (!result.data || result.data.length === 0) {
        console.warn("Inga övningar hittades för dagen.");
        setExercises([]);
        return;
      }
      const rearranged = rearrangeExercises(result.data);
      setExercises(rearranged);
      return result;
    } catch (error) {
      console.error("Fel vid hämtning:", error.message);
      setExercises([]);
      return { success: false, data: [] };
    } finally {
      setLoadingExercises(false);
    }
  };

  useEffect(() => {
    if (!programId || !day || !month) return;
    fetchExercisesData();
    fetchDay();
  }, [month, day, programId]);

  const handleMove = async (direction, exerciseId) => {
    setExercises((prev) => {
      const newExercises = [...prev].sort(
        (a, b) => a.index_order - b.index_order
      );
      const currentIndex = newExercises.findIndex((ex) => ex.id === exerciseId);

      if (currentIndex === -1) return prev;

      let swapIndex;
      if (direction === "asc") {
        // Flytta upp
        swapIndex = currentIndex - 1;
      } else if (direction === "desc") {
        // Flytta ned
        swapIndex = currentIndex + 1;
      }

      // Om out-of-bounds — rotera
      if (swapIndex < 0) {
        // flytta överst uppåt => till sist
        const [moved] = newExercises.splice(currentIndex, 1);
        newExercises.push(moved);
      } else if (swapIndex >= newExercises.length) {
        // flytta nederst nedåt => till först
        const [moved] = newExercises.splice(currentIndex, 1);
        newExercises.unshift(moved);
      } else {
        // normal swap
        const temp = newExercises[swapIndex];
        newExercises[swapIndex] = newExercises[currentIndex];
        newExercises[currentIndex] = temp;
      }

      const reordered = newExercises.map((ex, i) => ({
        ...ex,
        index_order: i,
      }));

      // 🔄 Anropa API efter state-uppdatering
      updateExerciseOrderApi(reordered).catch((err) => {
        console.error("❌ Kunde inte uppdatera ordningen:", err.message);
      });
      return reordered;
    });
  };

  function validateForm() {
    const newErrors = {};
    if (!exercises.title || exercises.title.length < 2) {
      newErrors.title = "Titeln måste vara minst 2 tecken.";
    }
    if (!exercises.duration || exercises.duration < 1) {
      newErrors.duration = "Ange en giltig längd.";
    }
    if (!exercises.description || exercises.description.length < 10) {
      newErrors.description = "Beskrivningen är för kort.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // complite notes
  const completeNotes = (e, exercise) => {
    e.preventDefault();
    setStep(2);
    setSelectedExercise(exercise);
  };

  //Delete
  const handleDeleteExercise = async (e, exerciseId) => {
    e.preventDefault();
    setExerciseToDelete(exerciseId);
    setConfirmOpen(true);
  };

  const confirmDeleteExercise = async () => {
    try {
      const result = await deleteExercise(exerciseToDelete);
      if (!result.success) {
        throw new Error(result.message || "Radering misslyckades");
      }
      setExercises((prev) => prev.filter((ex) => ex.id !== exerciseToDelete));
    } catch (error) {
      console.error("Kunde inte radera övning:", error.message);
    } finally {
      setConfirmOpen(false);
      setExerciseToDelete(null);
    }
  };

  const setDayMediaWrapper = (newMedia) => {
    console.log("newMedia:", newMedia);
    const media = newMedia["0"] ? newMedia["0"] : newMedia;

    let videoUrl = "";

    if (media.video_url) {
      const videoId = extractYouTubeId(media.video_url);
      videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      console.log("Embed URL:", videoUrl);
    } else {
      media.video_url = "";
    }
    setDayMedia({
      ...media,
      imageUrl: media.image_url || "",
      videoUrl,
    });
  };
  console.log(JSON.stringify(dayMedia, null, 2));

  return (
    <div className={styles.trainingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else {
              router.back();
            }
          }}
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
      />
      <UploadImageModal
        isImageModalOpen={isImageModalOpen}
        closeModalImg={closeModalImg}
        setTraining={setDayMedia}
      />
      {isExerciseModalOpen && (
        <div className="modal">
          <AddExerciseModal
            isExerciseModalOpen={isExerciseModalOpen}
            closeModalExercise={closeModalExercise}
            onExerciseAdded={async () => {
              const result = await fetchExercises({ month, day, programId });
              if (result.success) {
                setExercises(result.data);
              }
            }}
            trainingProgramId={programId}
            dayImageUrl={dayMedia.imageUrl}
            dayVideoUrl={dayMedia.videoUrl}
            month={month}
            day={day}
          ></AddExerciseModal>
        </div>
      )}

      <main className={styles.main}>
        {step === 1 ? (
          <>
            <DayMedia
              videoUrl={dayMedia.videoUrl}
              imageUrl={dayMedia.imageUrl}
              title={dayMedia.title}
            />

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
                  <Plus size={24} />
                </button>
              </div>
            </div>
            <div className={styles.wrapper}>
              <h2 className={styles.heading}>Dagens övningar</h2>
              {loadingExercises ? (
                <p className={styles.messages}>Laddar övningar...</p>
              ) : exercises.length === 0 ? (
                <p className={styles.messages}>Inga övningar tillagda ännu.</p>
              ) : (
                <ul className={styles.exerciseList}>
                  {console.log("exercises:", exercises)}
                  {[...exercises]
                    .sort((a, b) => a.index_order - b.index_order)
                    .map((exercise, index) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        onMove={handleMove}
                        onDelete={handleDeleteExercise}
                        onComplete={completeNotes}
                        onEdit={(exercise) => {
                          setSelectedExercise(exercise);
                          // setStep(2);
                        }}
                        onSaveEdit={(updatedExercise) => {
                          setExercises((prev) =>
                            prev.map((ex) =>
                              ex.id === updatedExercise.id
                                ? updatedExercise
                                : ex
                            )
                          );
                        }}
                      />
                    ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            {selectedExercise && (
              <ExerciseEditorView
                exercise={selectedExercise}
                onSave={(content) => {
                  console.log("Sparat innehåll:", content);
                }}
                onClose={closeModalExercise}
              />
            )}
          </>
        )}
        <ConfirmDialog
          open={confirmOpen}
          onConfirm={confirmDeleteExercise}
          onCancel={() => setConfirmOpen(false)}
          message="Vill du verkligen radera denna övning?"
        />
      </main>
    </div>
  );
}
