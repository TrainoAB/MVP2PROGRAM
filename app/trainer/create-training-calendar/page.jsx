"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header_DisplayButton from "@/components/Header_DisplayButton";
import Calendar from "@/components/Calendar/Calendar";
import Image from "next/image";
import styles from "./page.module.css";

export default function CreateTrainingProgramPlan() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("Kalender");
  const totalDays = searchParams.get("days");

  const exercise = {
    name: "Träningsvideo",
    videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
    imageUrl: "/traningsprogram.png",
  };

  // const exercise = {
  //   name: "Armhävningar",
  //   videoUrl: "",
  //   imageUrl: "/traningsprogram.png",
  // };

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/trainer/create-training")}
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
            src={exercise.imageUrl || "/assets/traningsprogram.png"}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <Header_DisplayButton
          links={["Kalender", "Beskrivning"]}
          onChange={(val) => setActive(val)}
        />
        {active === "Kalender" ? (
          <section className={styles.calendar}>
            {Array.from({ length: Math.ceil(totalDays / 28) }).map(
              (_, index) => (
                <Calendar
                  key={index}
                  trainer
                  month={index + 1}
                  days={Math.min(28, totalDays - index * 28)}
                />
              )
            )}
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