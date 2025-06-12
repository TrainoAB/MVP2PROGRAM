"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import extractYouTubeId from "@/functions/functions/";
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
    name: "Barbell Bent Over Row",
    videoUrl: "https://www.youtube.com/embed/cGzm1NRkDig?autoplay=1&mute=1",
    imageUrl: "/assets/trainingsprogram.png",
  });
  // videoUrl: "https://www.youtube.com/embed/KVzZG-Fxjto?autoplay=1&mute=1",

  const [price, setPrice] = useState(0);

    const setExerciseWrapper = (rawUrl) => {
        if (!rawUrl) return;
    if (rawUrl.videoUrl) {
      const videoId = extractYouTubeId(rawUrl.videoUrl);
      console.log("Extracted videoId:", videoId);
      rawUrl.videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      console.log("Embed URL:", rawUrl.videoUrl);
    }
    setExercise((prev) => ({
      name: rawUrl.name ?? prev.name,
      videoUrl: rawUrl.videoUrl ?? "",
      imageUrl: rawUrl.imageUrl ?? prev.imageUrl,
    }));
  };

  const GoOn = (e) => {
    e.preventDefault();
    router.push(`/trainer/month/${month}/day/${day}/create-training-details`);
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
              setTraining={setExercise}
            ></UploadImageModal>
            <main className={styles.main}>
              {exercise.videoUrl ? (
                <div className={styles.videoWrapper}>
                  <iframe
                    src={exercise.videoUrl}
                    title="YouTube video player"
                    allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <Image
                  src={exercise.imageUrl}
                  alt="Fallback image"
                  width={500}
                  height={500}
                  className={styles.fallbackImage}
                ></Image>
              )}
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
            </main>
          </div>
        </div>
      </div>
  );
}
