"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "./calendar.module.css";


export default function Calendar({
  onDayClick,
  trainer = false,
  days = 28,
  month = 1,
}) {
  const [activeDays, setActiveDays] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");

  const toggleDay = (dayNumber) => {
    console.log("Click:", dayNumber);

    // Om du vill hantera dag-klick utanför komponenten, skicka in en onDayClick(dayNumber)-funktion
    if (onDayClick) {
      onDayClick(dayNumber);
    } else {
      if (trainer) {
        router.push(`/trainer/month/${month}/day/${dayNumber}/create-training-exercise?programId=${programId}`
        );
      } else {
        router.push(`/user/month/${month}/day/${dayNumber}/training-program/`);
      }
    }
  };
  return (
    <>
      <header className={styles.header}>
        <h4 className={styles.topHeader}> {`Månad ${month}`}</h4>
      </header>
      <div className={styles.daysContainer}>
        {Array.from({ length: days }).map((_, index) => {
          const dayNumber = index + 1;
          const isActive = activeDays.includes(dayNumber);
          const isSunday = dayNumber % 7 === 0;
          const colorClass = isSunday ? styles.black : styles.purple;

          let dayClass = colorClass;
          if (isActive) dayClass += ` ${styles.active}`;

          return (
            <section
              key={index}
              className={`${styles.day} ${dayClass}`}
              onClick={() => toggleDay(dayNumber)}
            >
              {isActive ? (
                <Image
                  src="/assets/check-icon.svg"
                  alt="Check icon"
                  width={24}
                  height={24}
                />
              ) : (
                dayNumber
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
