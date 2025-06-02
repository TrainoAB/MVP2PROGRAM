"use client";
import { useState } from "react";
import styles from "./DaysSlider.module.css";

export default function DaysSlider({ value, onChange }) {
  const min = 0;
  const max = 84;

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    onChange?.(newValue);
  };

  const percent = ((value - min) / (max - min)) * 100;

  const sliderStyle = {
    background: `linear-gradient(to right, #8468ea 0%, #8468ea ${percent}%, #ddd ${percent}%, #ddd 100%)`,
  };

  return (
    <div className={styles.sliderContainer}>
      <label htmlFor="daysRange" className={styles.daysRange}>
        Välj dagar - {value}
      </label>
      <input
        type="range"
        id="daysRange"
        min="0"
        max="84"
        value={value}
        step="1"
        onChange={handleChange}
        className={styles.slider}
        style={sliderStyle}
      />
      <div className={styles.sliderValueContainer}>
        <span className={styles.sliderValueMin}>1</span>
        <span className={styles.sliderValueMax}>84</span>
      </div>
    </div>
  );
}
