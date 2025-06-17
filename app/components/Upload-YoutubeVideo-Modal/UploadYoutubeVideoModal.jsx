import React, { useState } from "react";
import Modal from "@/components/Modal";
import styles from "./UploadYoutubeVideo.module.css";

export default function UploadYoutubeVideoModal({
  isVideoModalOpen,
  closeModalVideo,
  setTraining,
  training
}) {
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const handleSubmitVideo = (e) => {
    e.preventDefault();

    const updatedtraining = {
      ...training,
      videoUrl: youtubeUrl,
      imageUrl: "",
      savedDate: new Date().toISOString(),
    };
    localStorage.setItem("training", JSON.stringify(updatedtraining));
    
    setTraining(updatedtraining);
    closeModalVideo();
  };


  return (
    <div className={styles.modalWrapper}>
      <Modal isOpen={isVideoModalOpen} onClose={closeModalVideo}>
        <div className={styles.closeButtonsWrapper}>
          <button onClick={closeModalVideo} className={styles.closeButton}>
            ×
          </button>
        </div>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}
