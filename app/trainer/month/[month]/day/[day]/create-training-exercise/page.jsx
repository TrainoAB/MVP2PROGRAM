"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import EditorWrapper from "@/app/components/Editor/EditorWrapper";
import { rearrangeExercises, updateExerciseOrderApi } from "@/app/functions/functions";
import { Plus, Trash2, ArrowUp, ArrowDown, Pencil } from "lucide-react";
import { fetchExercises } from "@/app/lib/actions";
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

  const [step, setStep] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loadingExercises, setLoadingExercises] = useState(false);

  const fetchDay = async () => {
    try {
      const res = await fetch(
        `/api/get_day_image_video?month=${month}&day=${day}&programId=${programId}`
      );
      const contentType = res.headers.get("content-type");
      // const body = await res.json();
      const body = contentType?.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        const fallback = contentType?.includes("application/json")
          ? await res.json()
          : await res.text();

        throw new Error(
          typeof fallback === "string"
            ? `HTML error: ${fallback.slice(0, 100)}...`
            : fallback.message
        );
      }

      if (!body) {
        const text = await res.text();
        console.error("Ogiltigt innehåll från API:", text);
        throw new Error("API returnerade inte JSON");
      }

      const { success, data, message } = body;

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
      // Optionally call setDayMediaWrapper(data) here if needed:
      setDayMediaWrapper(data);
      return { success: true, data };
      // });
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

      if (!result.success) {
        console.error("Fel från API:", result.message || result.error);
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
        setExercises([]); // Tom array om inget hittades
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
      setLoadingExercises(false); // Stoppa laddning (oavsett resultat)
    }
  };

  useEffect(() => {
    if (!programId || !day || !month) return;
    
    fetchExercisesData();
    }, [month, day, programId]);


  useEffect(() => {
    if (!programId || !day || !month) return;
    fetchDay();
  }, [month, day, programId]);

  const handleMove = async (direction, exerciseId) => {
    setExercises((prev) => {
      const newExercises = [...prev].sort(
        (a, b) => a.index_order - b.index_order
      );
      const currentIndex = newExercises.findIndex(
        (ex) => ex.id === exerciseId
      );

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

  }

  const completeNotes = (e, exercise) => {
    e.preventDefault();
    setStep(2);
    setSelectedExercise(exercise);
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
        {dayMedia.videoUrl ? (
          <div className={styles.videoWrapper}>
            {console.log("dayMedia.videoUrl:", dayMedia.videoUrl)}
            <iframe
              src={dayMedia.videoUrl}
              title="YouTube video player"
              width="100%"
              height="100%"
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
        {step === 1 ? (
          <>
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
                <p>Laddar övningar...</p>
              ) : (
                <ul className={styles.exerciseList}>
                  {[...exercises]
                    .sort((a, b) => a.index_order - b.index_order)
                    .map((exercise, index) => (
                      <li
                        key={exercise.id ?? index}
                        className={styles.exerciseCard}
                      >
                        <h3 className={styles.exerciseTitle}>
                          {exercise.title}
                        </h3>
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
                          exercise.video_url.includes("youtu.be")) ? (
                          <div className={styles.videoWrapper}>
                            <iframe
                              src={exercise.video_url}
                              width="100%"
                              height="100%"
                              title="YouTube video player"
                              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : null}
                        <div className={styles.buttonWrapperExercise}>
                          <div className={styles.sortGroup}>
                            <button
                              onClick={() => handleMove("asc", exercise.id)}
                            >
                              <ArrowUp size={20} />
                            </button>
                            <button
                              onClick={() => handleMove("desc", exercise.id)}
                            >
                              <ArrowDown size={20} />
                            </button>
                          </div>
                          <div className={styles.sortGroup}>
                            <button
                              className={styles.deleteButton}
                              onClick={() => {}}
                            >
                              <Trash2 size={20} />
                            </button>

                            <button
                              className={styles.editButton}
                              // onClick={onClick}
                              title="Redigera"
                            >
                              <Pencil size={18} className={styles.icon} />
                            </button>
                          </div>
                          <button
                            className={styles.completeButton}
                            onClick={(e) => completeNotes(e, exercise)}
                          >
                            {" "}
                            Kompletera
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className={styles.editorView}>
            {selectedExercise.image_url && (
              <img
                src={selectedExercise.image_url}
                alt={selectedExercise.title}
                className={styles.exerciseImage}
              />
            )}
            {selectedExercise.video_url &&
            (selectedExercise.video_url.includes("youtube.com") ||
              selectedExercise.video_url.includes("youtu.be")) ? (
              <div className={styles.videoWrapper}>
                <iframe
                  src={selectedExercise.video_url}
                  width="100%"
                  height="100%"
                  title="YouTube video player"
                  allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : null}
            <h4 className={styles.editorTitle}>
              {selectedExercise ? selectedExercise.title : ""}
            </h4>
            <EditorWrapper
              onContentSave={(content) => {
                console.log("EditorWrapper sparade innehåll:", content);
              }}
              onClose={() => {
                closeModalExercise();
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
