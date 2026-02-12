import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./TaleGenerationPage.module.css";

const MESSAGES = [
  "Кот Баюн подбирает слова...",
  "Волшебство почти готово...",
  "Осталось совсем чуть-чуть...",
];

export default function TaleGenerationPage() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);

    const navTimer = setTimeout(() => {
      navigate("/tale/1");
    }, 5000);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.content}>
        <h1 className={styles.title}>✨ Магия плетётся...</h1>
        <p className={styles.subtitle}>{MESSAGES[messageIndex]}</p>
        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => navigate("/create")}
        >
          Отменить
        </button>
      </div>
    </section>
  );
}

