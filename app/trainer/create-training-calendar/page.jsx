"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header_DisplayButton from "@/app/components/Header_DisplayButton";
import Calendar from "@/app/components/Calendar/Calendar";
import { extractYouTubeId } from "@/app/functions/functions";
import Image from "next/image";
import styles from "./page.module.css";
import { getDescription } from "@/app/lib/actions";

export default function CreateTrainingProgramPlan() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState("Kalender");
  const totalDays = searchParams.get("days");
  const programId = searchParams.get("programId");
  console.log("programId:", programId);
  // const [training, setTraining] = useState({
  //   videoUrl: null,
  //   imageUrl: null,
  //   savedDate: null
  // });
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!programId) return;

    getDescription(programId)
      .then(({ image_url, video_url, description }) => {
        setImageUrl(image_url);
        setVideoUrl(video_url);
        setDescription(description);
      })
      .catch(err => {
        console.error("Error fetching description:", err.message);
      });
    }, [programId]);

  const isYouTubeVideo = (url) => {
    if (!url) return false;
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  console.log("Fetching description for programId:", description);

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
        {videoUrl && isYouTubeVideo(videoUrl) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                videoUrl
              )}?autoplay=1&mute=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          />
        ) : null}
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
            {/* <h4 className={styles.title}>Beskrivning</h4> */}
            <p className={styles.descriptionText}>{description}</p>
          </section>
        )}
      </main>
    </div>
  );
}
