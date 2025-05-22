import { useEffect, useState } from "react";

import styles from './Header_DisplayButton.module.css';

export default function Header_DisplayButton({ links = ["calendar", "description"], onChange }) {
  const [active, setActive] = useState(links[0]);

  useEffect(() => {
    active && onChange(active);
  }, [active]);

  return (
    <div className={styles.hdbWrap}>
      {links.map((link) => (
        <p
          className={`${styles.hdbButton} ${ active === link ? styles.hdbActive : ""}`}
          key={link}
          onClick={() => setActive(link)}
        >
          {link}
        </p>
      ))}
    </div>
  );
};
