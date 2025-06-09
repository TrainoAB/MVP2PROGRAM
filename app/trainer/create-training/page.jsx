"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DaysSlider from "@/components/Days_Slider/DaysSlider";
import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const [totalDays, setTotalDays] = useState(28);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [hydrated, setHydrated] = useState(false);

  const [training, setTraining] = useState({
    name: "Träningsvideo",
    videoUrl: "",
    imageUrl: "/assets/traningsprogram.png",
  });


  useEffect(() => {
    // Om training.videoUrl är tom, försök läsa från localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("training");
      if (stored) {
        setTraining(JSON.parse(stored));
      }
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("training", JSON.stringify(training));
    }
  }, [training]);

  // const exercise = {
  //   name: "Träningsvideo",
  //   videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
  //   imageUrl: "/traningsprogram.png",
  // };

  // const exercise = {
  //   name: "Armhävningar",
  //   videoUrl: "https://www.youtube.com/embed/AlPMhqvfmw4?autoplay=1&mute=1",
  //   imageUrl: "",
  // };

  const GoOn = (e) => {
    e.preventDefault();
    // Här kan du lägga till logik för att spara träningsprogrammet
    console.log("Träningsprogram sparat med följande data:");
    console.log("Dagar:", totalDays);
    router.push(`/trainer/create-training-calendar?days=${totalDays}`);
  };

  if (!hydrated) return null;

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/trainer/create-training")}
        ></button>
        <h1 className={styles.title}>Skapa träningsprogram</h1>
      </header>
      <UploadYoutubeVideoModal
        isVideoModalOpen={isVideoModalOpen}
        closeModalVideo={closeModalVideo}
        setTraining={setTraining}
        training={training}
      ></UploadYoutubeVideoModal>
      <UploadImageModal
        isImageModalOpen={isImageModalOpen}
        closeModalImg={closeModalImg}
        setTraining={setTraining}
      ></UploadImageModal>
      <main className={styles.main}>
        {training.videoUrl &&
        (training.videoUrl.includes("youtube.com") ||
          training.videoUrl.includes("youtu.be")) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                training.videoUrl
              )}?autoplay=1&mute=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={training.imageUrl || "/assets/trainingsprogram.png"}
            alt="Träningsbild"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <form className={styles.form}>
          <p className={styles.imageLoadTitle}>Omslag</p>
          <div className={styles.buttonContainer}>
            <button
              onClick={openModalImg}
              type="button"
              className={styles.chooseImageButton}
            >
              Välj bild
            </button>
            <button
              onClick={openModalVideo}
              type="button"
              className={styles.openBtn}
            >
              Välj Video
            </button>
          </div>
          <DaysSlider value={totalDays} onChange={setTotalDays} />
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Pris
            </label>
            <input
              type="number"
              id="price"
              placeholder="Kr"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Beskrivning
            </label>
            <textarea
              type="text"
              id="description"
              placeholder="Skriv minst 10 bokstäver."
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={GoOn} className={styles.goOnButton}>
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
