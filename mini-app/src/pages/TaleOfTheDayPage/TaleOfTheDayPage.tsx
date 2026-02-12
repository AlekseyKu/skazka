import { useNavigate } from "react-router-dom";

import styles from "./TaleOfTheDayPage.module.css";
import { CHARACTERS, MOCK_TALE_OF_THE_DAY } from "../../shared/api/mockData";

export default function TaleOfTheDayPage() {
  const navigate = useNavigate();
  const character = CHARACTERS.find(
    (c) => c.id === MOCK_TALE_OF_THE_DAY.voice,
  );

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Лимит сказок на сегодня исчерпан</h1>
        <p className={styles.subtitle}>
          Но у нас есть кое-что особенное специально для тебя!
        </p>

        <div className={styles.card}>
          <p className={styles.badge}>🌟 СКАЗКА ДНЯ</p>
          <h2 className={styles.cardTitle}>{MOCK_TALE_OF_THE_DAY.title}</h2>
          <p className={styles.cardMeta}>
            🎧 {MOCK_TALE_OF_THE_DAY.duration} •{" "}
            {character ? character.name : "Кот Баюн"}
          </p>
          <p className={styles.cardDescription}>
            {MOCK_TALE_OF_THE_DAY.description}
          </p>
          <button
            type="button"
            className={styles.listenButton}
            onClick={() => navigate(`/tale/${MOCK_TALE_OF_THE_DAY.id}`)}
          >
            ▶ Послушать сказку
          </button>
        </div>

        <div className={styles.bottom}>
          <p className={styles.bottomText}>Хочешь создавать свои сказки?</p>
          <button
            type="button"
            className={styles.subscriptionsLink}
            onClick={() => navigate("/subscription")}
          >
            Посмотреть подписки
          </button>
        </div>
      </div>
    </section>
  );
}

