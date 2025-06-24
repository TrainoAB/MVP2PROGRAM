"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DaysSlider from "@/components/Days_Slider/DaysSlider";
import UploadImageModal from "@/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { extractYouTubeId, getImageOrVideoIfSavedToday } from "@/functions/functions";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  // const [totalDays, setTotalDays] = useState(28);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [hydrated, setHydrated] = useState(false);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState(28);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [trainerId, setTrainerId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, price, days, imageUrl, videoUrl, trainerId }),
    })

    const data = await res.json()
    alert(data.message)
  }

  const [training, setTraining] = useState({
    name: "Träningsvideo",
    videoUrl: null,
    imageUrl: null,
    savedDate: new Date().toISOString(),
  });

  useEffect(() => {
    // Om training.videoUrl är tom, försök läsa från localStorage
    if (typeof window !== "undefined") {
      const todayTraining = getImageOrVideoIfSavedToday();
      if (todayTraining) {
        setTraining(todayTraining);
      }
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("training", JSON.stringify(training));
    }
  }, [training]);


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
        ) : training.imageUrl ? (
          <Image
            src={training.imageUrl}
            alt="Träningsbild"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        ) : null}
        <form className={styles.form} onSubmit={handleSubmit}>
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
          <DaysSlider value={totalDays} onChange={setDays} />
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Pris
            </label>
            <input
              type="number"
              id="price"
              placeholder="Kr"
              className={styles.input}
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" onClick={GoOn} className={styles.goOnButton}>
              Fortsätt
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}