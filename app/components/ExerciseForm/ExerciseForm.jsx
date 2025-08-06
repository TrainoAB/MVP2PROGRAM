import { useState } from "react";
import { X } from "lucide-react";
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
          className={`${styles.inputField} ${
            errors.title ? styles.inputError : ""
          }`}
        />
        {errors.title && <p className={styles.errorText}>{errors.title}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="duration">
          Varaktighet (minuter)
        </label>
        <input
          type="number"
          name="duration"
          id="duration"
          value={form.duration}
          onChange={handleChange}
          className={`${styles.inputField} ${
            errors.duration ? styles.inputError : ""
          }`}
        />
        {errors.duration && (
          <p className={styles.errorText}>{errors.duration}</p>
        )}
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
        <button onClick={handleSubmit} className={styles.completeButton}>
          Spara
        </button>
        <button onClick={onCancel} className={styles.deleteButton}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
