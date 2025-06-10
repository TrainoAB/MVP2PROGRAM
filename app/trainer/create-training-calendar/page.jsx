"use client";

import { useState, useEffect } from "react";
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

  const [training, setTraining] = useState({
    name: "Träningsvideo",
    videoUrl: "",
    imageUrl: "/traningsprogram.png",
  });

  console.log(training);
  useEffect(() => {
    // Läs från localStorage när sidan laddas
    const savedTraining = localStorage.getItem("training");
    if (savedTraining) {
      setTraining(JSON.parse(savedTraining));
    }
  }, []);

  const isYouTubeVideo = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
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
        {isYouTubeVideo(training.videoUrl) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                training.videoUrl
              )}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <Image
            src={training.imageUrl || "/assets/tranngsprogram.png"}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          />
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
function extractYouTubeId(url) {
  if (!url) return "";
  const regex = /(?:v=|\/embed\/|\.be\/)([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : "";
}