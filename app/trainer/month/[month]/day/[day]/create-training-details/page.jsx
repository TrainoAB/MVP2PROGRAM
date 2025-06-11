"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditorWrapper from "@/components/Editor/EditorWrapper";



import styles from "./page.module.css";

// const LexicalEditor = dynamic(() => import("@/components/Editor/LexicalEditor_old"), {
//   ssr: false,
// });

export default function CreateTrainingProgram() {
  const [exercise, setExercise] = useState({
    name: "Barbell Bent Over Row",
    videoUrl: "https://www.youtube.com/embed/cGzm1NRkDig?autoplay=1&mute=1",
    imageUrl: "/assets/traningsprogram.png",
  });
  // videoUrl: "https://www.youtube.com/embed/KVzZG-Fxjto?autoplay=1&mute=1",
  const [content, setContent] = useState("");
  const router = useRouter();



  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.back()}
        ></button>
        <h1 className={styles.title}>Skapa träningsprogram</h1>
      </header>
      <main className={styles.main}>
        {exercise.videoUrl ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={exercise.videoUrl}
              title="YouTube video player"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={exercise.imageUrl}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Kompleterande anteckningar.
            </label>
            <div>
              <EditorWrapper />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
