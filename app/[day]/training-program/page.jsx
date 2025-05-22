"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import workouts from "@/data/workouts.json";

import styles from "./page.module.css";

export default function TrainingProgramPage() {
  const params = useParams();
  const day = params.day  
  const router = useRouter();

  return (
    <>
      <div className={styles.traingProgramContainer}>
        <header className={styles.header}>
          <button
            className={styles.backBtn}
            onClick={() => router.push("/training-program-plan")}
          ></button>
          <h1 className={styles.title}>Träningsprogramtitel</h1>
          <h3 className={styles.mounthDay}>Månad 1 / Dag {day}</h3>
        </header>
        <main className={styles.main}>
          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube.com/embed/xYcxxW5f5fQ?autoplay=1&mute=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <section className={styles.descriptionContainer}>
            <h4 className={styles.titleCompleted}>1/2 Avklarade</h4>
            {workouts.exercises.map((exercise) => (
              <div key={exercise.name} className={styles.descriptionItem}>
                <div className={styles.iconContainer}>
                  <span className={styles.chevronIcon}></span>
                  <Link
                    href={{
                      pathname: "../training-program-exercise",
                      query: {
                        name: exercise.name,
                        duration: exercise.duration,
                      },
                    }}
                    className={styles.exerciseNameLink}
                  >
                    {exercise.name}
                  </Link>
                </div>
                <p className={styles.descriptionText}>
                  <span key={exercise.name} className={styles.duration}>
                    {exercise.duration}
                  </span>
                  <span className={styles.properties}>
                    {" "}
                    {exercise.sets} sets: {exercise.reps.join(", ")} (
                    {exercise.note})
                  </span>
                </p>
                <div className={styles.checkContainer}>
                  <span className={styles.check}></span>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}

