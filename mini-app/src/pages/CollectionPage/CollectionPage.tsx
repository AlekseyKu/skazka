import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

import styles from "./CollectionPage.module.css";
import { CHARACTERS, MOCK_TALES } from "../../shared/api/mockData";

type Filter = "all" | "audio" | "text" | "favorite";

export default function CollectionPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [favorites, setFavorites] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(MOCK_TALES.map((t) => [t.id, t.is_favorite])),
  );

  const filtered = useMemo(() => {
    return MOCK_TALES.filter((tale) => {
      if (filter === "audio") return tale.type === "audio";
      if (filter === "text") return tale.type === "text";
      if (filter === "favorite") return favorites[tale.id];
      return true;
    });
  }, [filter, favorites]);

  const formatMeta = (tale: (typeof MOCK_TALES)[number]) => {
    const created = new Date(tale.date);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let when = "сегодня";
    if (diffDays === 1) when = "вчера";
    else if (diffDays > 1) when = `${diffDays} дн. назад`;

    const isAudio = tale.type === "audio";
    return `${isAudio ? "🎧 аудио" : "📖 текст"} • ${when}`;
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isEmptyFavorites =
    filter === "favorite" && filtered.length === 0;

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Моя коллекция</h1>

      {/* Фильтры */}
      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.filterChip} ${
            filter === "all" ? styles.filterChipActive : ""
          }`}
          onClick={() => setFilter("all")}
        >
          Все
        </button>
        <button
          type="button"
          className={`${styles.filterChip} ${
            filter === "audio" ? styles.filterChipActive : ""
          }`}
          onClick={() => setFilter("audio")}
        >
          🎧 Аудио
        </button>
        <button
          type="button"
          className={`${styles.filterChip} ${
            filter === "text" ? styles.filterChipActive : ""
          }`}
          onClick={() => setFilter("text")}
        >
          📖 Текст
        </button>
        <button
          type="button"
          className={`${styles.filterChip} ${
            filter === "favorite" ? styles.filterChipActive : ""
          }`}
          onClick={() => setFilter("favorite")}
        >
          ⭐ Избранное
        </button>
      </div>

      {/* Список сказок */}
      <div className={styles.list}>
        {filtered.map((tale) => {
          const character = CHARACTERS.find((c) => c.id === tale.voice);
          const favorite = favorites[tale.id];
          return (
            <div
              key={tale.id}
              className={styles.card}
              onClick={() => navigate(`/tale/${tale.id}`)}
            >
              {character && (
                <img
                  src={character.avatar}
                  alt={character.name}
                  className={styles.avatar}
                />
              )}
              <div className={styles.cardText}>
                <div className={styles.cardTitle}>{tale.title}</div>
                <div className={styles.cardMeta}>{formatMeta(tale)}</div>
              </div>
              <button
                type="button"
                className={styles.starButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(tale.id);
                }}
                aria-label="Добавить в избранное"
              >
                <Star
                  className={styles.starIcon}
                  aria-hidden
                  fill={favorite ? "var(--accent-warm)" : "none"}
                  stroke={
                    favorite
                      ? "var(--accent-warm)"
                      : "rgba(255,255,255,0.4)"
                  }
                />
              </button>
            </div>
          );
        })}
      </div>

      {isEmptyFavorites && (
        <p className={styles.empty}>
          ⭐ Пока нет избранных сказок. Нажми звёздочку, чтобы сохранить!
        </p>
      )}
    </section>
  );
}

