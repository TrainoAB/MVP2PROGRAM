"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header_DisplayButton from "@/components/Header_DisplayButton";
import Calendar from "@/components/Calendar/Calendar";
import Image from "next/image";
// import FallbackImg from "/traningsprogram.png";
import styles from "./page.module.css";

export default function TrainingProgramPlan() {
  const router = useRouter();
  const [active, setActive] = useState("Kalender");

  const exercise = {
    name: "Armhävningar",
    videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
    imageUrl: "/assets/armhavningar.png"
  };

  // const exercise = {
  //   name: "Armhävningar",
  //   videoUrl: "", 
  //   imageUrl: "",
  // };

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/")}
        ></button>
        <h1 className={styles.title}>Träningsprogramtitel</h1>
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
              <span className={styles.pictureDiv}></span>
        )}
        <div className={styles.buttonContainer}>
          <button className={styles.restartButton}>Börja om</button>
          <Header_DisplayButton
            links={["Kalender", "Beskrivning"]}
            onChange={(val) => setActive(val)}
          />
        </div>
        {active === "Kalender" ? (
          <section className={styles.calendar}>
            <Calendar />
          </section>
        ) : (
          <section className={styles.description}>
            <h4 className={styles.title}>Title or description</h4>
            <p>
              Free text that works according to MD? So we can write both titles
              and text and ul lists whatever the user wants.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
