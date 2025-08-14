import React from "react";
import EditorWrapper from "./EditorWrapper";
import styles from "./ExerciseEditorView.module.css";

export default function ExerciseEditorView({ exercise, onSave, onClose }) {
  if (!exercise) return null;

  const isYouTube =
    exercise.video_url?.includes("youtube.com") ||
    exercise.video_url?.includes("youtu.be");

  return (
    <div className={styles.editorView}>
      {exercise.image_url && (
        <img
          src={exercise.image_url}
          alt={exercise.title}
          className={styles.exerciseImage}
        />
      )}

      {isYouTube && (
        <div className={styles.videoWrapper}>
          <iframe
            src={exercise.video_url}
            width="100%"
            height="100%"
            title="YouTube video player"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <h4 className={styles.exerciseTitle}>{exercise.title}</h4>

      <EditorWrapper
        exerciseId={exercise.id}
        onContentSave={(content) => {
          onSave(exercise.id, content);
        }}
        onClose={onClose}
      />
    </div>
  );
}
