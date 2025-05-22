"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import  imageUrl from "@/assets/traningsprogram.png";

import styles from "./page.module.css";

export default function TrainingProgramExercise() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const duration = searchParams.get("duration");
  const router = useRouter();
  // const [completed, setCompleted] = useState(false);

  // var onCompleted = (e) => {
  //   e.preventDefault();
  //   console.log("Completed is now:", !completed);
  //   setCompleted(!completed);
  // };
  // https://www.youtube.com/embed/fjffvt_SGKY?autoplay=1&mute=1
    {
      /* <span className={styles.pictureDiv}></span> */
    }

  const exercise = {
    name: "TestVideoBilder",
    videoUrl: "", // Lägg till eller ta bort för att testa fallback
    imageUrl: "/traningsprogram.png",
  };

  // const exercise = {
  //   name: "Armhävningar",
  //   videoUrl: "",
  //   imageUrl: "",
  // };

  return (
    <>
      <div className={styles.traingProgramContainer}>
        <header className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => router.back()}
            aria-label="Back to training program"
          ></button>
          <h1 className={styles.title}>Träningsprogramtitel</h1>
          <div className={styles.nameDurationContainer}>
            <h3 className={styles.exerciseName}>{name}</h3>
            <span className={styles.duration}>{duration}</span>
          </div>
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
          <section className={styles.descriptionContainer}>
            {/* <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onCompleted}
                className={styles.completedButton}
              >
                {completed ? "Avklarad" : "Markera Avklarad"}
              </button>
            </div> */}
            <article className={styles.descriptionItem}>
              <h4 className={styles.item}>1</h4>
              <p className={styles.descriptionText}>
                Free text that works according to MD? So we can write both
                titles and text and ul lists whatever the user wants.
              </p>
            </article>
            <article className={styles.descriptionItem}>
              <h4 className={styles.item}>2</h4>
              <p className={styles.descriptionText}>
                Free text that works according to MD? So we can write both
                titles and text and ul lists whatever the user wants.
              </p>
            </article>
          </section>
        </main>
      </div>
    </>
  );
}
