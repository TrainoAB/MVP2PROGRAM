"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client"; 
import DaysSlider from "@/app/components/Days_Slider/DaysSlider";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { saveTrainingProgram } from "@/app/lib/actions";
import { extractYouTubeId, getImageOrVideoIfSavedToday } from "@/app/functions/functions";
import styles from "./page.module.css";

export default function CreateTrainingProgram() {
  const router = useRouter();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [hydrated, setHydrated] = useState(false);

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [days, setDays] = useState(28);
  const [trainerId, setTrainerId] = useState("");

  const [training, setTraining] = useState({
    name: "Träningsvideo",
    videoUrl: null,
    imageUrl: null,
    trainerId:null,
    savedDate: new Date().toISOString(),
  });

  // useEffect(() => {
  //   const getTrainerId = async () => {
  //     const supabase = createClient();

  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();

  //     if (error) {
  //       console.error("Kunde inte hämta användare:", error.message);
  //     }

  //     if (user) {
  //       console.log("Inloggad användare:", user);
  //       setTraining((prev) => ({
  //         ...prev,
  //         trainerId: user.id,
  //       }));
  //     }
  //   };
  //   getTrainerId();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit körs");
    setLoading(true);

    console.log("Beskrivning:", description);
    console.log("Pris:", price, "->", Number(price));
    console.log("Dagar:", days);
    console.log("Bild-URL:", training.imageUrl);
    console.log("Video-URL:", training.videoUrl);
    // console.log("Trainer ID:", training.trainerId);

    if (!description) throw new Error("Beskrivning saknas!");
    if (!price || Number(price) <= 0)
      throw new Error("Pris saknas eller ogiltigt!");
    if (!days) throw new Error("Antal dagar saknas!");
    try {
      const program = await saveTrainingProgram({
        description,
        price: Number(price),
        days,
        training,
      })

      if (
        !program.success ||
        !program.data ||
        !program.data.id
      ) {
        throw new Error("Kunde inte spara träningsprogrammet korrekt.");
      }
      const programId = program.data.id;
      if (!programId) {
        throw new Error("Kunde inte hämta programId efter sparning.");
      }
      console.log("Träningsprogram sparat:", program);
      console.log("Träningsprogram sparat, id:", programId);

      router.push(
        `/trainer/create-training-calendar?days=${days}&programId=${programId}`
      );
    }
    catch (error) {
      console.error("Fel vid sparning:", error.message);
      alert(error.message || "Något gick fel vid sparning av träningsprogrammet.");
    }
    finally {
          setLoading(false);
      }
    };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const todayTraining = getImageOrVideoIfSavedToday();
      if (todayTraining) {
        setTraining(todayTraining);
      }
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("training", JSON.stringify(training));
    }
  }, [training]);

  if (!hydrated) return null;

  return (
    <div className={styles.traingProgramContainer}>
      <header className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/trainer/create-training")}
        ></button>
        <h1 className={styles.title}>Skapa träningsprogram</h1>
      </header>
      <UploadYoutubeVideoModal
        isVideoModalOpen={isVideoModalOpen}
        closeModalVideo={closeModalVideo}
        setTraining={setTraining}
        setVideoUrl={(videoUrl) =>
          setTraining((prev) => ({ ...prev, videoUrl }))
        }
        training={training}
      ></UploadYoutubeVideoModal>
      <UploadImageModal
        isImageModalOpen={isImageModalOpen}
        closeModalImg={closeModalImg}
        setTraining={setTraining}
      ></UploadImageModal>
      <main className={styles.main}>
        {training.videoUrl &&
        (training.videoUrl.includes("youtube.com") ||
          training.videoUrl.includes("youtu.be")) ? (
          <div className={styles.videoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                training.videoUrl
              )}?autoplay=1&mute=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : training.imageUrl ? (
          <Image
            src={training.imageUrl}
            alt="Träningsbild"
            width={500}
            height={500}
            className={styles.fallbackImage}
          ></Image>
        ) : null}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
              onClick={openModalVideo}
              type="button"
              className={styles.openBtn}
            >
              Välj Video
            </button>
          </div>
          <DaysSlider value={days} onChange={setDays} />
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Pris
            </label>
            <input
              type="number"
              id="price"
              placeholder="Kr"
              min="1"
              step="1"
              inputMode="numeric"
              className={styles.input}
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              disabled={loading}
              className={styles.goOnButton}
            >
              {loading ? "Sparar..." : "Fortsätt"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

