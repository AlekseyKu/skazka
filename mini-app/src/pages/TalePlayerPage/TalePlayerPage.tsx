import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, RotateCcw, RotateCw } from "lucide-react";

import styles from "./TalePlayerPage.module.css";
import { CHARACTERS, MOCK_TALES } from "../../shared/api/mockData";
import { useUIStore } from "../../shared/stores/uiStore";

export default function TalePlayerPage() {
  const params = useParams<{ id: string }>();
  const showToast = useUIStore((s) => s.showToast);

  const taleId = Number(params.id ?? "0");
  const tale = useMemo(
    () => MOCK_TALES.find((t) => t.id === taleId) ?? MOCK_TALES[0],
    [taleId],
  );

  const character = CHARACTERS.find((c) => c.id === tale.voice);

  const [position, setPosition] = useState(0);
  const [duration] = useState(192); // 3:12 в секундах (mock)
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [favorite, setFavorite] = useState(tale.is_favorite);

  const togglePlay = () => {
    setPlaying((prev) => !prev);
  };

  const formatTime = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, duration));
    const m = Math.floor(clamped / 60);
    const s = Math.floor(clamped % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number) => {
    setPosition(value);
  };

  const cycleSpeed = () => {
    setSpeed((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  const toggleFavorite = () => {
    setFavorite((prev) => !prev);
  };

  const handleSkip = (delta: number) => {
    setPosition((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > duration) return duration;
      return next;
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.content}>
        {/* Hero */}
        <div className={styles.hero}>
          {character && (
            <img
              src={character.avatar}
              alt={character.name}
              className={styles.heroAvatar}
              style={{ borderColor: character.glowColor }}
            />
          )}
          <p className={styles.heroNarrator}>
            {character ? `${character.name} рассказывает` : "Наш рассказчик"}
          </p>
          <h1 className={styles.heroTitle}>{tale.title}</h1>
        </div>

        {/* Плеер */}
        <div className={styles.playerCard}>
          <div className={styles.seekbarWrapper}>
            <input
              type="range"
              min={0}
              max={duration}
              value={position}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className={styles.seekbar}
            />
          </div>
          <div className={styles.timeRow}>
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className={styles.controlsMain}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => handleSkip(-15)}
              aria-label="Назад на 15 секунд"
            >
              <RotateCcw className={styles.controlIcon} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.playButton}
              onClick={togglePlay}
              aria-label={playing ? "Пауза" : "Воспроизвести"}
            >
              {playing ? (
                <span className={styles.playSymbol}>⏸</span>
              ) : (
                <span className={styles.playSymbol}>▶</span>
              )}
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => handleSkip(15)}
              aria-label="Вперёд на 15 секунд"
            >
              <RotateCw className={styles.controlIcon} aria-hidden />
            </button>
          </div>

          <div className={styles.controlsBottom}>
            <button
              type="button"
              className={styles.pill}
              onClick={cycleSpeed}
            >
              {speed}x
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={toggleFavorite}
              aria-label="Добавить в избранное"
            >
              <Heart
                className={styles.controlIcon}
                aria-hidden
                fill={favorite ? "var(--accent-warm)" : "none"}
                stroke={
                  favorite ? "var(--accent-warm)" : "rgba(255,255,255,0.7)"
                }
              />
            </button>
          </div>
        </div>

        {/* Текст сказки */}
        <div className={styles.taleTextWrapper}>
          <p className={styles.taleText}>{tale.text}</p>
        </div>
      </div>
    </section>
  );
}

