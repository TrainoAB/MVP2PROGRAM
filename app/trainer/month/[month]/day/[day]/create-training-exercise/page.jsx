"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Plus } from "lucide-react";

import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import extractYouTubeId from "@/functions/functions/";
import AddExerciseModal from "@/components/Add_Exercise_Modal/AddExerciseModal";
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

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const openModalExercise = () => setIsExerciseModalOpen(true);
  const closeModalExercise= () => setIsExerciseModalOpen(false);

  const [exercise, setExercise] = useState({
    name: "Barbell Bent Over Row",
    videoUrl: "https://www.youtube.com/embed/cGzm1NRkDig?autoplay=1&mute=1",
    imageUrl: "/assets/trainingsprogram.png",
  });
  // videoUrl: "https://www.youtube.com/embed/KVzZG-Fxjto?autoplay=1&mute=1",


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
      {isExerciseModalOpen && (
        <div className="modal">
          <AddExerciseModal
            isExerciseModalOpen={isExerciseModalOpen}
            closeModalExercise={closeModalExercise}
          ></AddExerciseModal>
        </div>
      )}
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
          <div className={styles.buttonWrapper}>
            <div className={styles.buttonContainerExercise}>
              <label htmlFor="exercise-button" className={styles.buttonLabel}>
                Lägg till övning
              </label>
              <button
                id="exercise-button"
                type="button"
                onClick={openModalExercise}
                className={styles.openBtnExercise}
              >
                {/* Lägg till övning */}
                <Plus size={24} />
              </button>
            </div>
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


