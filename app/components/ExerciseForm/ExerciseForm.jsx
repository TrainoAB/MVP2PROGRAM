import { useState } from "react";
import { X } from "lucide-react";
import UploadImageModal from "@/app/components/Upload_Image_Modal/UploadImageModal";
import UploadYoutubeVideoModal from "@/app/components/Upload-YoutubeVideo-Modal/UploadYoutubeVideoModal";
import { extractYouTubeId } from "@/app/functions/functions";
import styles from "./ExerciseForm.module.css";

export default function ExerciseForm({ exercise, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: exercise.title || "",
    duration: exercise.duration || 1,
    description: exercise.description || "",
    image_url: exercise.image_url || "",
    video_url: exercise.video_url || "",
    id: exercise.id,
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const openModalImg = () => setIsImageModalOpen(true);
  const closeModalImg = () => setIsImageModalOpen(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const openModalVideo = () => setIsVideoModalOpen(true);
  const closeModalVideo = () => setIsVideoModalOpen(false);

  const setExerciseWrapper = (rawUrl) => {
    if (!rawUrl) return;

    const videoUrl = rawUrl.videoUrl ?? rawUrl.video_url ?? null;
    const imageUrl = rawUrl.imageUrl ?? rawUrl.image_url ?? null;

    setForm((prev) => {
      let updated = { ...prev };

      if (videoUrl) {
        const videoId = extractYouTubeId(videoUrl);
        updated.video_url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        updated.image_url = "";
      }

      if (imageUrl) {
        updated.image_url = imageUrl;
        updated.video_url = ""; 
      }

      return updated;
    });
  };
    const [errors, setErrors] = useState({});

    const validate = () => {
      const newErrors = {};
      if (!form.title || form.title.trim().length < 2) {
        newErrors.title = "Minst 2 tecken krävs.";
      }
      if (!form.duration || form.duration < 1) {
        newErrors.duration = "Minst 1 minut krävs.";
      }
      if (!form.description || form.description.trim().length < 10) {
        newErrors.description = "Minst 10 tecken krävs.";
      }
      return newErrors;
    };

  const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: name === "duration" ? parseInt(value, 10) : value,
      }));
    };

    const handleSubmit = () => {
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      onSave(form);
  };

    return (
      <div className={styles.exerciseForm}>
        <div className={styles.closeWrapper}>
          <button onClick={onCancel} className={styles.closeButton}>
            <X size={20} strokeWidth={3} />
          </button>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="title">
            Titel
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            className={styles.inputProgramTitle}
          />
          {errors.title && <p className={styles.errorText}>{errors.title}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="duration">
            Varaktighet
          </label>
          <div className={styles.durationInput}>
            <input
              type="number"
              name="duration"
              id="duration"
              min="1"
              max="120"
              inputMode="numeric"
              value={form.duration}
              onChange={handleChange}
              className={styles.inputTime}
            />
            <span className={styles.timeSuffix}>min</span>
          </div>
          {errors.duration && (
            <p className={styles.errorText}>{errors.duration}</p>
          )}
          {form.image_url && (
            <img
              src={form.image_url}
              alt={form.title}
              className={styles.exerciseImage}
            />
          )}

          {form.video_url &&
          (form.video_url.includes("youtube.com") ||
            form.video_url.includes("youtu.be")) ? (
            <div className={styles.videoWrapper}>
              <iframe
                src={form.video_url}
                width="100%"
                height="100%"
                title="YouTube video player"
                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
        <UploadYoutubeVideoModal
          isVideoModalOpen={isVideoModalOpen}
          closeModalVideo={closeModalVideo}
          setTraining={setExerciseWrapper}
        ></UploadYoutubeVideoModal>
        <UploadImageModal
          isImageModalOpen={isImageModalOpen}
          closeModalImg={closeModalImg}
          setTraining={setExerciseWrapper}
        ></UploadImageModal>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={openModalImg}
            className={styles.chooseImageButton}
          >
            Ändra bild
          </button>
          <button
            type="button"
            onClick={openModalVideo}
            className={styles.openBtn}
          >
            Ändra Video
          </button>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="description">
            Beskrivning
          </label>
          <textarea
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
            className={`${styles.inputField} ${
              errors.description ? styles.inputError : ""
            }`}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>

        <div className={styles.buttonWrapperExercise}>
          <button onClick={handleSubmit} className={styles.standardButton}>
            Spara
          </button>
        </div>
      </div>
    );
}
