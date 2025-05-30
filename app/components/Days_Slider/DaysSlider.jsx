"use client";
import { useState } from "react";
import styles from "./DaysSlider.module.css";

export default function MinuteSlider() {
    const [value, setValue] = useState(30);
    const min = 0;
    const max = 90;
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
        max="90"
        value={value}
        step="1"
        onChange={(e) => setValue(Number(e.target.value))}
        className={styles.slider}
        style={sliderStyle}
      />
      <div className={styles.sliderValueContainer}>
        <span className={styles.sliderValueMin}>1</span>
        <span className={styles.sliderValueMax}>90</span>
      </div>
    </div>
  );
}
