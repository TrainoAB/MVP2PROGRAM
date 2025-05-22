"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

export default function TrainingProgramExercise() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const duration = searchParams.get("duration");
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  var onCompleted = (e) => {
    e.preventDefault();
    console.log("Completed is now:", !completed);
    setCompleted(!completed);
  };

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
          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/fjffvt_SGKY?autoplay=1&mute=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <section className={styles.descriptionContainer}>
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onCompleted}
                className={styles.completedButton}
              >
                {completed ? "Avklarad" : "Markera Avklarad"}
              </button>
            </div>
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
