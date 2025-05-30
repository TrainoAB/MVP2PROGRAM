"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";
import Image from "next/image";
import DaysSlider from "@/components/Days_Slider/DaysSlider";
import { UploadCloud } from "lucide-react";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();
  const [totalDays, setTotalDays] = useState(30);
  const [isOpen, setIsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  const [exercise, setExercise] = useState({
    name: "Träningsvideo",
    videoUrl: "",
    imageUrl: "/traningsprogram.png",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const handleSubmitVideo = (e) => {
    e.preventDefault();
    console.log("YouTube URL:", youtubeUrl);

    setExercise((prev) => ({
      ...prev,
      videoUrl: youtubeUrl,
    }));
    closeModal();
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();
    console.log("Bild URL:", imageUrl);

    setExercise((prev) => ({
      ...prev,
      imageUrl: imageUrl,
    }));
    closeModalImg();
  };

  // Ladda upp bild
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      const uploadedPath = data.path; // t.ex. "/assets/minbild.jpg"

      // Spara i komponentens state
      setExercise((prev) => ({
        ...prev,
        imageUrl: uploadedPath,
      }));

      alert("Uppladdad! Bildens sökväg: " + uploadedPath);
    } else {
      alert("Misslyckades att ladda upp bild.");
    }
  };

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

  const GoOn = (e) => {
    e.preventDefault();
    // Här kan du lägga till logik för att spara träningsprogrammet
    console.log("Träningsprogram sparat med följande data:");
    console.log("Dagar:", totalDays);
    router.push(`/trainer/create-training-calendar?days=${totalDays}`);
  };

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/trainer/create-training")}
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
            <button className={styles.modalButtons} onClick={handleSubmitVideo}>
              Spara
            </button>
            <button className={styles.modalButtons} onClick={closeModal}>
              Avbryt
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isImageModalOpen} onClose={closeModalImg}>
        <div className={styles.modalContent}>
          <h4>Ladda upp bild</h4>
          <form onSubmit={handleUpload} encType="multipart/form-data">
            <div className={styles.modalImageButtonsWrapper}>
              <label htmlFor="imageUpload" className={styles.uploadButton}>
                <UploadCloud className={styles.uploadIcon} />
                Välj bild
              </label>
              <input
                type="file"
                id="imageUpload"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              <button className={styles.uploadImgButton} type="submit">
                Ladda upp bild
              </button>
            </div>
          </form>
          Eller
          <h4>Lägg till bildlnamn</h4>
          <input
            type="text"
            placeholder="Lägg till bildnamn"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.input}
          />
          <div className={styles.modalButtonsWrapper}>
            <button className={styles.modalButtons} onClick={handleSubmitImage}>
              Spara
            </button>
            <button className={styles.modalButtons} onClick={closeModalImg}>
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
            src={exercise.imageUrl || "/assets/trainingsprogram.png"}
            alt="Fallback image"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        )}
        <form className={styles.form}>
          <p className={styles.imageLoadTitle}>Omslag</p>
          <div className={styles.buttonContainer}>
            <button
              onClick={openModalImg}
              type="button"
              className={styles.chooseImageButton}
            >
              Välj bild
            </button>
            <button
              onClick={openModal}
              type="button"
              className={styles.openBtn}
            >
              Välj Video
            </button>
          </div>
          <DaysSlider value={totalDays} onChange={setTotalDays} />
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Pris
            </label>
            <input
              type="text"
              id="price"
              placeholder="Kr"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Beskrivning
            </label>
            <textarea
              type="text"
              id="description"
              placeholder="Skriv minst 10 bokstäver."
              className={styles.inputField}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={GoOn} className={styles.goOnButton}>
              Fortsätt
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
