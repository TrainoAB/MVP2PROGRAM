"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header_DisplayButton from "@/components/Header_DisplayButton";
import Calendar from "@/components/Calendar/Calendar";
import styles from "./page.module.css";

export default function TrainingProgramPlan() {
  const router = useRouter();
  const [active, setActive] = useState("Kalender");

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
          <video className={styles.video} autoPlay muted loop playsInline>
            <source
              src="https://traino.nu/app/assets/bg800.mp4"
              type="video/mp4"
            />
            <source
              src="https://traino.nu/app/assets/bg800.webp"
              type="video/webp"
            />
            Your browser does not support the video tag.
          </video>
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
