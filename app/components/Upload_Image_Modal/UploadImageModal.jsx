import React, { useState } from 'react';
import { UploadCloud } from "lucide-react";

import Modal from '@/components/Modal';
import styles from './UploadImageModal.module.css';

export default function UploadImageModal({ isImageModalOpen, closeModalImg, setExercise }) {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

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

  return (
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
          placeholder="/assets/bildensnamn.png eller t.ex .gif, .jpg"
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
  );
}


