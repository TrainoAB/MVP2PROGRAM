"use client";

import { useState } from "react";
import Image from "next/image";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import EditorWrapper from "@/app/components/Editor/EditorWrapper";
import { extractYouTubeId } from "@/app/functions/functions";
import styles from "./AddExerciseModal.module.css";

export default function AddExerciseModal({
  isExerciseModalOpen,
  closeModalExercise,
}) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [exercise, setExercise] = useState({
    name: "",
    videoUrl: null,
    imageUrl: null,
  });

  const [step, setStep] = useState(1);

  const setExerciseWrapper = (rawUrl) => {
    if (!rawUrl) return;
    if (rawUrl.videoUrl) {
      const videoId = extractYouTubeId(rawUrl.videoUrl);
      rawUrl.videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    setExercise((prev) => ({
      ...prev,
      name: rawUrl.name ?? prev.name,
      videoUrl: rawUrl.videoUrl ?? "",
      imageUrl: rawUrl.imageUrl ?? prev.imageUrl,
    }));
  };

  const handleSetTraining = (updatedFields) => {
    setExercise((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const completeNotes = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Här sparar du till databasen – t.ex. med fetch eller Supabase
      const { name, duration, description, videoUrl, imageUrl } = exercise;
  
      // Exempel: skicka till din API-route eller Supabase
       fetch("/api/saveExercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, duration, description, videoUrl, imageUrl }),
      });
  
      // När sparningen är klar, stäng modalen
      closeModalExercise();
      console.log("Modalen STÄNGS!");
    } catch (error) {
      console.error("Fel vid sparning:", error);
      // Här kan du även visa ett felmeddelande
    }
  };

  if (!isExerciseModalOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButtonsWrapper}>
          {step > 1 && (
            <>
              <button
                className={styles.backBtn}
                onClick={() => setStep(1)}
              ></button>
              <h4 className={styles.title}>Kompleterande anteckningar</h4>
              <button onClick={closeModalExercise} className={styles.closeBtn}>
                ✕
              </button>
            </>
          )}
        </div>
        <div className={styles.traingProgramContainer}>
          <UploadYoutubeVideoModal
            isVideoModalOpen={isVideoModalOpen}
            closeModalVideo={closeModalVideo}
            setTraining={setExerciseWrapper}
          ></UploadYoutubeVideoModal>
          <UploadImageModal
            isImageModalOpen={isImageModalOpen}
            closeModalImg={closeModalImg}
            setTraining={handleSetTraining}
          ></UploadImageModal>
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
                alt="Bild på övning"
                width={500}
                height={500}
                className={styles.fallbackImage}
              ></Image>
            ) : null}
            {step === 1 ? (
              <form
                className={`${styles.form} ${
                  exercise.imageUrl || exercise.videoUrl
                    ? styles.formExpanded
                    : styles.formCompact
                }`}
              >
                <div className={styles.closeButtonsWrapper}>
                  <p className={styles.imageLoadTitle}>Omslag</p>
                  <button
                    onClick={closeModalVideo}
                    className={styles.closeButton}
                  >
                    ×
                  </button>
                </div>
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
                <div className={styles.inputGroup}>
                  <label htmlFor="duration" className={styles.label}>
                    Välj passets längd
                  </label>
                  <input
                    type="number"
                    id="duration"
                    onChange={(e) =>
                      setExercise({ ...exercise, duration: e.target.value })
                    }
                    value={exercise.duration}
                    placeholder="minuter"
                    className={styles.inputTime}
                  />
                  <label htmlFor="title" className={styles.label}>
                    Ange titel på övningen.
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Övningen titel"
                    className={styles.inputProgramTitle}
                    value={exercise.name}
                    onChange={(e) =>
                      setExercise({ ...exercise, name: e.target.value })
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Beskrivning
                  </label>
                  <textarea
                    type="text"
                    id="description"
                    placeholder="4 sets: 15, 12, 8, 4 reps (Dropset to 50% of weight and go till failure on last set.)"
                    value={exercise.description || ""}
                    onChange={(e) =>
                      setExercise({ ...exercise, description: e.target.value })
                    }
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={completeNotes}
                    className={styles.standardButton}
                  >
                    Kompletera
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={styles.standardButton}
                  >
                    Spara
                  </button>
                </div>
              </form>
            ) : (
              <EditorWrapper
                onContentSave={(content) => {
                  console.log("EditorWrapper sparade innehåll:", content);
                }}
                onClose={() => {
                  closeModalExercise(); // modal stängs först när spara är klart
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
