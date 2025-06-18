"use client";

import { useState } from "react";
import Image from "next/image";
import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import EditorWrapper from "@/components/Editor/EditorWrapper"
import { extractYouTubeId } from "@/functions/functions";
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
  const [showEditor, setShowEditor] = useState(false);

  const [exercise, setExercise] = useState({
    name: "Övningsbild eller video.",
    videoUrl: null,
    imageUrl: null,
  });
  // videoUrl: "https://www.youtube.com/embed/KVzZG-Fxjto?autoplay=1&mute=1",

  const [price, setPrice] = useState(0);

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

  const GoOn = (e) => {
    e.preventDefault();
    setShowEditor(true);
  };

  if (!isExerciseModalOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButtonsWrapper}>
          <button onClick={closeModalExercise} className={styles.closeBtn}>
            ✕
          </button>
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
                alt="Fallback image"
                width={500}
                height={500}
                className={styles.fallbackImage}
              ></Image>
            ) : null}
            {!showEditor ? (
              <form className={styles.form}>
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
                <div className={styles.inputGroup}>
                  <label htmlFor="duration" className={styles.label}>
                    Välj passets längd
                  </label>
                  <input
                    type="number"
                    id="duration"
                    onChange={(e) => setPrice({ duration: e.target.value })}
                    placeholder="minuter"
                    className={styles.inputTime}
                  />
                  <label htmlFor="title" className={styles.label}>
                    Ange titel på övningen.
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="min"
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
                    onClick={GoOn}
                    className={styles.goOnButton}
                  >
                    Fortsätt
                  </button>
                </div>
              </form>
            ) : (
              <EditorWrapper
                onContentSave={(content) => {
                  console.log("Sparat innehåll:", content);
                  // du kan även stänga modalen eller gå vidare här
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
