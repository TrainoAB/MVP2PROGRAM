"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import MinuteSlider from "@/components/Minute_Slider/MinuteSlider";
import Image from "next/image";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const params = useParams();
  const day = params.day;
  const [minutes, setMinutes] = useState(30);

  const exercise = {
    name: "Träningsvideo",
    videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
    imageUrl: "/traningsprogram.png",
  };

  // const exercise = {
  //   name: "Armhävningar",
  //   videoUrl: "",
  //   imageUrl: "",
  // };

  const GoOn = (e) => {
    e.preventDefault();
    // Här kan du lägga till logik för att spara träningsprogrammet
    console.log("Träningsprogram sparat med följande data:");
    console.log("Dagar:", minutes);
    router.push(`/trainer/${day}/choose-exercises`);
  }

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push('/trainer/create-training-calendar')}
        ></button>
        <h1 className={styles.title}>Skapa träningsprogram</h1>
      </header>
      <main className={styles.main}>
        {exercise.videoUrl &&
        (exercise.videoUrl.includes("youtube.com") ||
          exercise.videoUrl.includes("youtu.be")) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={exercise.videoUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={exercise.imageUrl || "assets/trainingsprogram.png"}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <form className={styles.form}>
          <p className={styles.imageLoadTitle}>Omslag</p>
          <div className={styles.buttonContainer}>
            <button className={styles.chooseImageButton}>Välj bild</button>
            {/* <button onClick={openModal} className={styles.openBtn}>
                Välj Video
              </button> */}
            <button className={styles.openBtn}>Välj Video</button>
          </div>
          <MinuteSlider />
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Pris
            </label>
            <input
              type="text"
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
