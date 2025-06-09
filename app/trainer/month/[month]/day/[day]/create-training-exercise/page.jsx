"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const params = useParams();
  const { month, day } = params;
  console.log("params", params); 

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

  const setExerciseWrapper = (newExercise) => {
    if (newExercise.videoUrl) {
      const videoId = extractYouTubeId(newExercise.videoUrl);
      console.log("Extracted videoId:", videoId);
      newExercise.videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
      console.log("Embed URL:", newExercise.videoUrl);
    }
    setExercise(
      newExercise.videoUrl ? newExercise : { ...newExercise, videoUrl: "" }
    );
  };

  const GoOn = (e) => {
    e.preventDefault();
    router.push(`/trainer/month/${month}/day/${day}/create-training-details`);
  };

  return (
    <div className={styles.traingProgramContainer}>
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
              onChange ={(e) => setPrice({ duration: e.target.value })}
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
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="button" onClick={GoOn} className={styles.goOnButton}>
              Fortsätt
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return "";
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : "";
}
