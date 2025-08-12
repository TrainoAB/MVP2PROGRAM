"use client";

import { useState } from "react";
import Image from "next/image";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import EditorWrapper from "@/app/components/Editor/EditorWrapper";
import { extractYouTubeId } from "@/app/functions/functions";
import { saveExercise } from "@/app/lib/actions";
import styles from "./AddExerciseModal.module.css";

export default function AddExerciseModal({
  isExerciseModalOpen,
  closeModalExercise,
  onExerciseAdded,
  trainingProgramId,
  dayImageUrl,
  dayVideoUrl,
  month,
  day,
}) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const [isSaving, setIsSaving] = useState(false);

  const [exercise, setExercise] = useState({
    videoUrl: null,
    imageUrl: null,
    duration: "",
    title: "",
    description: "",
    index_order: 0,
  });

  const [errors, setErrors] = useState({
    duration: "",
    title: "",
    description: "",
  });

  const training_program_id = trainingProgramId || null;

  console.log("exercise", exercise);

  const [step, setStep] = useState(1);

  const setExerciseWrapper = (rawUrl) => {
    if (!rawUrl) return;

    const videoUrl = rawUrl.videoUrl ?? rawUrl.video_url ?? null;
    const imageUrl = rawUrl.imageUrl ?? rawUrl.image_url ?? null;

    let updatedVideoUrl = videoUrl;

    if (videoUrl) {
      const videoId = extractYouTubeId(videoUrl);
      updatedVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }

    setExercise((prev) => ({
      ...prev,
      videoUrl: updatedVideoUrl ?? prev.videoUrl,
      imageUrl: imageUrl ?? prev.imageUrl,
      duration: rawUrl.duration ?? prev.duration,
      title: rawUrl.title ?? prev.title,
      description: rawUrl.description ?? prev.description,
      index_order: rawUrl.index_order ?? prev.index_order,
    }));
  };

  const handleSetTraining = (updatedFields) => {
    setExercise((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const completeNotes = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulär skickas!");

    const { title, duration, description } = exercise;

    const newErrors = {
      duration: "",
      title: "",
      description: "",
    };

    let hasError = false;

    if (!duration || String(duration).trim().length < 1) {
      newErrors.duration = "* Beräknade längd krävs.";
      hasError = true;
    }

    if (!title || String(title).trim().length < 2) {
      newErrors.title = "* Övningens namn krävs.";
      hasError = true;
    }

    if (!description || String(description).trim().length < 10) {
      newErrors.description = "* Beskrivning krävs (minst 10 tecken)";
      hasError = true;
    }

     if (hasError) {
       setErrors(newErrors);
       return;
     }
    console.log(errors);
    console.log("duration:", duration, "Length:", duration.length);
    console.log("title:", title, "Length:", title.length);
    console.log("Description:", description, "Length:", description.length);

    try {
      setIsSaving(true);
      const { imageUrl, videoUrl, title, duration, description, index_order } = exercise;

      const month_number = parseInt(month);
      const day_number = parseInt(day);

      const savedExercise = await saveExercise({
        training_program_id,
        title,
        duration,
        description,
        dayImageUrl,
        videoUrl,
        dayVideoUrl,
        imageUrl,
        index_order,
        month_number,
        day_number,
      });

      if (!savedExercise.success) {
        throw new Error("Kunde inte spara träningsprogrammet korrekt.");
      }
      console.log("Träningsprogram sparat:", savedExercise);
      setIsSaving(false);
      console.log("Sparning lyckades!");
      closeModalExercise();
      onExerciseAdded?.();
      console.log("Modalen STÄNGS!");
    } catch (error) {
      console.error("Fel vid sparning:", error);
    }
  };

  if (!isExerciseModalOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.closeButtonsWrapper}>
          {step > 1 && (
            <>
              <button
                className={styles.backBtn}
                onClick={() => setStep(1)}
              ></button>
              <h4 className={styles.title}>Kompleterande anteckningar</h4>
            </>
          )}
        </div>
        <div className={styles.traingProgramContainer}>
          <div className={styles.closeButtonsWrapper}>
            <p className={styles.imageLoadTitle}>Omslag</p>
            {step === 1 && (
              <button
                type="button"
                onClick={closeModalExercise}
                aria-label="Stäng modal"
                className={styles.closeButton}
              >
                ×
              </button>
            )}
          </div>
          <UploadYoutubeVideoModal
            isVideoModalOpen={isVideoModalOpen}
            closeModalVideo={closeModalVideo}
            setTraining={setExerciseWrapper}
          ></UploadYoutubeVideoModal>
          <UploadImageModal
            isImageModalOpen={isImageModalOpen}
            closeModalImg={closeModalImg}
            setTraining={handleSetTraining}
          ></UploadImageModal>
          <main className={styles.main}>
            {typeof exercise.videoUrl === "string" &&
            (exercise.videoUrl.includes("youtube.com") ||
              exercise.videoUrl.includes("youtu.be")) ? (
              <div className={styles.videoWrapper}>
                <iframe
                  src={exercise.videoUrl}
                  title="YouTube video player"
                  allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : exercise.imageUrl ? (
              <Image
                src={exercise.imageUrl}
                alt="Bild på övning"
                width={500}
                height={500}
                className={styles.fallbackImage}
              ></Image>
            ) : null}
            {step === 1 ? (
              <form
                onSubmit={handleSubmit}
                className={`${styles.form} 
                ${
                  errors.duration || errors.title || errors.description
                    ? styles.formError
                    : ""
                }
                ${
                  exercise.imageUrl || exercise.videoUrl
                    ? styles.formExpanded
                    : styles.formCompact
                }`}
              >
                {/* <div className={styles.closeButtonsWrapper}>
                  <p className={styles.imageLoadTitle}>Omslag</p>
                  {step === 1 && (
                    <button
                      type="button"
                      onClick={closeModalExercise}
                      aria-label="Stäng modal"
                      className={styles.closeButton}
                    >
                      ×
                    </button>
                  )}
                </div> */}

                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={openModalImg}
                    className={styles.chooseImageButton}
                  >
                    Välj bild
                  </button>
                  <button
                    type="button"
                    onClick={openModalVideo}
                    className={styles.openBtn}
                  >
                    Välj Video
                  </button>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="duration" className={styles.label}>
                    Välj passets längd
                  </label>
                  <div className={styles.inputTimeContainer}>
                    <input
                      type="number"
                      id="duration"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!isNaN(value) && value > 0) {
                          setExercise({ ...exercise, duration: value });
                          setErrors((prev) => ({ ...prev, duration: "" }));
                        } else if (e.target.value === "") {
                          setExercise({ ...exercise, duration: "" });
                        }
                      }}
                      value={exercise.duration}
                      className={`${styles.inputTime} ${
                        errors.duration ? styles.inputError : ""
                      }`}
                    />
                    <span className={styles.timeSuffix}>min</span>
                  </div>
                  {errors.duration && (
                    <p className={styles.errorText}>{errors.duration}</p>
                  )}
                  <label htmlFor="title" className={styles.label}>
                    Ange titel på övningen.
                  </label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Övningen titel"
                    className={`${styles.inputProgramTitle} ${
                      errors.title ? styles.inputError : ""
                    }`}
                    value={exercise.title}
                    onChange={(e) => {
                      setExercise({ ...exercise, title: e.target.value });
                      if (e.target.value.trim().length >= 2) {
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                  />
                  {errors.title && (
                    <p className={styles.errorText}>{errors.title}</p>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Beskrivning
                  </label>
                  <textarea
                    type="text"
                    id="description"
                    placeholder="4 sets: 15, 12, 8, 4 reps (Dropset to 50% of weight and go till failure on last set.)"
                    value={exercise.description || ""}
                    onChange={(e) => {
                      setExercise({ ...exercise, description: e.target.value });
                      if (e.target.value.trim().length >= 10) {
                        setErrors((prev) => ({ ...prev, description: "" }));
                      }
                    }}
                    className={`${styles.inputField} ${
                      errors.description ? styles.inputError : ""
                    }`}
                  />
                  {errors.description && (
                    <p className={styles.errorText}>{errors.description}</p>
                  )}
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={completeNotes}
                    className={styles.standardButton}
                  >
                    Kompletera
                  </button>
                  <button
                    type="submit"
                    className={styles.standardButton}
                    disabled={isSaving}
                  >
                    {isSaving ? "Sparar..." : "Spara"}
                  </button>
                </div>
              </form>
            ) : (
              <EditorWrapper
                onContentSave={(content) => {
                  console.log("EditorWrapper sparade innehåll:", content);
                }}
                onClose={() => {
                  closeModalExercise();
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
