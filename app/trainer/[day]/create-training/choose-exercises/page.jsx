"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header_DisplayButton from "@/components/Header_DisplayButton";
import MinuteSlider from "@/components/Minute_Slider/MinuteSlider";
import Image from "next/image";
import imageUrl from "@/assets/traningsprogram.png";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
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
    router.push("/create-training/choose-exercises");
  };

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/")}
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
            src={exercise.imageUrl || imageUrl}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <form className={styles.form}>
          <div className={styles.buttonContainer}>
            <p className={styles.imageLoadTitle}>Omslag</p>
            <button className={styles.chooseImageButton}>Välj bild</button>
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
            <button onClick={GoOn} className={styles.chooseImageButton}>
              Fortsätt
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
