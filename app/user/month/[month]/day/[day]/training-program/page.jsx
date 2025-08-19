"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import workouts from "@/app/data/workouts.json";

import styles from "./page.module.css";

export default function TrainingProgramPage() {
  const params = useParams();
  const { month, day } = params;
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [completedTask, setCompletedTask] = useState(
    workouts.exercises.map(() => false)
  );

  const onCompleted = (e) => {
    e.preventDefault();
    const newCpmpleted = !completed;
    setCompleted(newCpmpleted);
    setCompletedTask(workouts.exercises.map(() => newCpmpleted));
  };

  const toggleCompleted = (index) => {
    setCompletedTask((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

// Check if all tasks are completed
  useEffect(() => {
    const allCompleted = completedTask.every((task) => task);
    setCompleted(allCompleted);
  }, [completedTask]);

    const exercise = {
      name: "Armhävningar",
      videoUrl: "https://www.youtube.com/embed/xYcxxW5f5fQ?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
      imageUrl: "/trainingsprogram.png",
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
            onClick={() => router.push("/user/training-program-plan")}
          ></button>
          <h1 className={styles.title}>Träningsprogramtitel</h1>
          <h3 className={styles.mounthDay}>
            Månad {month} / Dag {day}
          </h3>
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
              src={exercise.imageUrl || "/assets/trainingsprogram.png"}
              alt="Fallback image"
              width={500}
              height={500}
              className={styles.fallbackImage}
            ></Image>
          )}
          <section className={styles.descriptionContainer}>
            <h4 className={styles.titleCompleted}>1/2 Avklarade</h4>
            {workouts.exercises.map((exercise, index) => (
              <div key={exercise.name}>
                <Link
                  href={{
                    pathname: "./training-program/exercise",
                    query: {
                      name: exercise.name,
                      duration: exercise.duration,
                    },
                  }}
                  className={styles.descriptionItem}
                >
                  <div className={styles.iconContainer}>
                    <span className={styles.chevronIcon}></span>
                    <span className={styles.exerciseNameLink}>
                      {exercise.name}
                    </span>
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCompleted(index);
                      }}
                      className={styles.iconButton}
                      aria-label={
                        completedTask ? "Markera avklarad" : "Avklarad"
                      }
                    >
                      {completedTask[index] ? (
                        <span className={styles.checked}></span>
                      ) : (
                        <span className={styles.unchecked}></span>
                      )}
                    </button>
                  </div>
                </Link>
              </div>
            ))}
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onCompleted}
                className={styles.completedButton}
              >
                {completed ? (
                  <>
                    Avklarad <span className={styles.checkedButton}></span>
                  </>
                ) : (
                  "Markera Avklarad"
                )}
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
