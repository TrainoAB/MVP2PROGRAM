import React from "react";
import Image from "next/image";
import styles from "./DayMedia.module.css";

export default function DayMedia({ imageUrl, videoUrl, title = "" }) {
  const isYouTube =
    videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  if (!videoUrl && !imageUrl) {
    return null;
  }

  return (
    <div className={styles.mediaContainer}>
      {videoUrl && isYouTube ? (
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl}
            title={title || "YouTube video player"}
            width="100%"
            height="100%"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={title || "Tränarens bild"}
          width={500}
          height={500}
          className={styles.fallbackImage}
        />
      ) : null}

      {title && <h3 className={styles.mediaTitle}>{title}</h3>}
    </div>
  );
}
