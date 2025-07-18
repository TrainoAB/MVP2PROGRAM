"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DaysSlider from "@/app/components/Days_Slider/DaysSlider";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { saveTrainingProgram } from "@/app/lib/actions";
import { extractYouTubeId } from "@/app/functions/functions";
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

  const [errors, setErrors] = useState({
    description: "",
    price: "",
  });

  const [training, setTraining] = useState({
    videoUrl: null,
    imageUrl: null,
    trainerId: null,
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

    const newErrors = {
      description: "",
      price: "",
    };

  const trimmedDescription = description.trim();
  const trimmedPrice = price.trim();
    
 let hasError = false;

 if (!trimmedDescription || trimmedDescription.length < 10) {
   newErrors.description = "Beskrivning krävs (minst 10 tecken)";
   hasError = true;
 }

if (!trimmedPrice || isNaN(trimmedPrice) || Number(trimmedPrice) <= 0) {
  newErrors.price = "Pris krävs och måste vara större än 0";
  hasError = true;
}

 setErrors(newErrors);

  console.log("Description:",description,"Length:",description.trim().length);  

  if (hasError) return;
    setLoading(true);
    
    console.log("Beskrivning:", description);
    console.log("Pris:", price, "->", Number(price));
    console.log("Dagar:", days);
    console.log("Bild-URL:", training.imageUrl);
    console.log("Video-URL:", training.videoUrl);
    console.log("Tränar-ID:", training.trainerId);

    try {
      const program = await saveTrainingProgram({
        description: trimmedDescription,
        price: Number(trimmedPrice),
        days,
        training,
      });

      if (!program.success || !program.data || !program.data.id) {
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
    } catch (error) {
      console.error("Fel vid sparning:", error.message);
      alert( error.message || "Något gick fel vid sparning av träningsprogrammet.");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

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
        <form
          className={`${styles.form} ${
            errors.description || errors.price ? styles.formError : ""
          }`}
          onSubmit={handleSubmit}
          noValidate
        >
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
              className={`${styles.input} ${
                errors.price ? styles.invalidInput : ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                setPrice(value);
                if (value && Number(value) > 0) {
                  setErrors((prev) => ({ ...prev, price: "" }));
                }
              }}
              value={price}
            />
            {errors.price && <p className={styles.errorText}>{errors.price}</p>}
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Beskrivning
            </label>
            <textarea
              type="text"
              id="description"
              placeholder="Skriv minst 10 bokstäver."
              className={`${styles.inputField} ${
                errors.description ? styles.invalidInput : ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                setDescription(value);
                if (value.trim().length >= 10) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              value={description}
            />
            {errors.description && (
              <p className={styles.errorText}>{errors.description}</p>
            )}
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
