"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header_DisplayButton from "@/components/Header_DisplayButton";
import Calendar from "@/components/Calendar/Calendar";
import Modal from "@/components/Modal"; 
import Image from "next/image";
import styles from "./page.module.css";

export default function CreateTrainingProgramPlan() {
  const router = useRouter();
  const [active, setActive] = useState("Kalender");

  const [isOpen, setIsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("YouTube URL:", youtubeUrl);
    setExercise((prev) => ({
      ...prev,
      videoUrl: youtubeUrl,
    }));
    closeModal();
  };
  
  console.log("Modal öppen:", isOpen);

  const [exercise, setExercise] = useState({
    name: "Träningsvideo",
    videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1",
    imageUrl: "/traningsprogram.png",
  });
  

    // const exercise = {
    //   name: "Träningsvideo",
    //   videoUrl: "https://www.youtube.com/embed/0xcutfMELrk?autoplay=1&mute=1", // Lägg till eller ta bort för att testa fallback
    //   imageUrl: "/traningsprogram.png",
    // };

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
          <h1 className={styles.title}>Skapa träningsprogram</h1>
        </header>
        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className={styles.modalContent}>
            <h2>Lägg till YouTube-länk</h2>
            <input
              type="text"
              placeholder="Klistra in YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalButtonsWrapper}>
              <button className={styles.modalButtons} onClick={handleSubmit}>
                Spara
              </button>
              <button
                className={styles.modalButtons}
                onClick={closeModal}
                style={{ marginLeft: "1rem" }}
              >
                Avbryt
              </button>
            </div>
          </div>
        </Modal>
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
          <div className={styles.buttonContainer}>
            <button className={styles.chooseImageButton}>Välj bild</button>
            <button onClick={openModal} className={styles.openBtn}>
              Välj Video
            </button>
          </div>
          <Header_DisplayButton
            links={["Kalender", "Beskrivning"]}
            onChange={(val) => setActive(val)}
          />
          {active === "Kalender" ? (
            <section className={styles.calendar}>
              <Calendar trainer />
            </section>
          ) : (
            <section className={styles.description}>
              <h4 className={styles.title}>Title or description</h4>
              <p>
                Free text that works according to MD? So we can write both
                titles and text and ul lists whatever the user wants.
              </p>
            </section>
          )}
        </main>
        {/* {isOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Lägg till YouTube-länk</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Klistra in YouTube-länk"
                  className={styles.input}
                />
                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.saveBtn}>
                    Spara
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className={styles.cancelBtn}
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )} */}
      </div>
    );
}