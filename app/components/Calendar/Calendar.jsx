"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import checkButton from "@/assets/check.svg";
import styles from "./calendar.module.css";


export default function Calendar() {
  const days = 30;
  const [activeDays, setActiveDays] = useState([]);
  const router = useRouter();

  const toggleDay = (dayNumber) => {
    console.log("Click:", dayNumber);
    // setActiveDays((prev) =>
    //   prev.includes(dayNumber) ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber],
    router.push(`${dayNumber}/training-program/`);
    }
    return (
      <>
        <header className={styles.header}>
          <h4 className={styles.topHeader}>Månad 1</h4>
        </header>
        <div className={styles.daysContainer}>
        {Array.from({ length: days }).map((_, index) => {
          const dayNumber = index + 1;
          const isActive = activeDays.includes(dayNumber);
          const isSunday = dayNumber % 7 === 0;
          const isToday = dayNumber === new Date().getDate();
       
          const colorClass = isSunday ? styles.black : styles.purple;

          let dayClass = isSunday
            ? styles.black
            : styles.purple;

          if (isToday) dayClass += ` ${styles.today}`;
          if (isActive) dayClass += ` ${styles.active}`;

          return (
            <section
              key={index}
              className={`${styles.day} ${colorClass}`}
              onClick={() => toggleDay(dayNumber)}
            >
              {isActive ? (
                <Image
                  src={checkButton}
                  alt="Check icon"
                  width={24}
                  height={24}
                />
              ) : (
                dayNumber
              )}
            </section>
          );
        })
        }
        </div>
      </>
    );
  }
