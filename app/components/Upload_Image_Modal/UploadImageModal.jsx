"use client";

import React, { useState } from 'react';
import { UploadCloud } from "lucide-react";
import Modal from '@/components/Modal';
import styles from './UploadImageModal.module.css';

export default function UploadImageModal({ isImageModalOpen, closeModalImg, setTraining }) {
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);

  // Hantera manuell URL-inskrivning
  const handleSubmitImage = (e) => {
    e.preventDefault();
    const updated = {
      imageUrl: imageUrl,
      videoUrl: "",
    };
    localStorage.setItem("training", JSON.stringify(updated));
    setTraining(updated);
    closeModalImg();
  };

  // När användaren väljer en fil
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  // När man trycker på "Ladda upp bild"
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
      const uploadedPath = data.path;

      setTraining({
        imageUrl: uploadedPath,
        videoUrl: "",
      });

      alert("Uppladdad! Bildens sökväg: " + uploadedPath);
      closeModalImg();
    } else {
      alert("Misslyckades att ladda upp bild.");
    }
  };

  // 🔥 Detta är den faktiska return-satsen från komponenten
  if (!isImageModalOpen) return null;

  return (
    <Modal
      isOpen={isImageModalOpen}
      onClose={closeModalImg}
      className={styles.modal}
    >
      <div className={styles.modalContent}>
        <h4 className={styles.header}>Ladda upp bild</h4>
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

        <p className={styles.or}>eller</p>

        <h4>Lägg till bildlänk</h4>
        <form onSubmit={handleSubmitImage}>
          <input
            type="text"
            placeholder="/assets/bildensnamn.png eller t.ex .gif, .jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={styles.input}
          />
          <div className={styles.modalButtonsWrapper}>
            <button type="button" className={styles.modalButtons} onClick={closeModalImg}>
              Avbryt
            </button>
            <button type="submit" className={styles.modalButtons}>
              Spara
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

