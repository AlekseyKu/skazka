import { Bookmark, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import styles from "./LibraryPage.module.css";
import {
  CHARACTERS,
  MOCK_LIBRARY_TALES,
  MOCK_LULLABIES,
  MOCK_TALE_OF_THE_DAY,
  MOCK_USER,
  getLullabyOfTheDay,
} from "../../shared/api/mockData";
import { useUIStore } from "../../shared/stores/uiStore";
import { useSavedLullabiesStore } from "../../shared/stores/savedLullabiesStore";

export default function LibraryPage() {
  const navigate = useNavigate();
  const openPaywall = useUIStore((s) => s.openPaywall);
  const { savedIds, add: saveLullaby, remove: unsaveLullaby, has: isSaved } = useSavedLullabiesStore();

  const [filter, setFilter] = useState<"all" | "night">("all");

  const subscription = MOCK_USER.subscription;
  const isFree = subscription === "free";
  const canUseLullaby = subscription === "family" || subscription === "premium";
  const visibleCount = isFree ? 3 : MOCK_LIBRARY_TALES.length;

  const lullabyOfTheDay = getLullabyOfTheDay();
  const savedLullabies = MOCK_LULLABIES.filter((l) => savedIds.includes(l.id));

  const filteredTales =
    filter === "night"
      ? MOCK_LIBRARY_TALES.filter((t) => t.theme === "sleep")
      : MOCK_LIBRARY_TALES;

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Библиотека сказок</h1>
      <p className={styles.subtitle}>
        Послушай готовые сказки от наших рассказчиков
      </p>

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
            filter === "night" ? styles.filterChipActive : ""
          }`}
          onClick={() => setFilter("night")}
        >
          🌙 На ночь
        </button>
      </div>

      {/* Сказка дня */}
      <button
        type="button"
        className={styles.taleOfDayCard}
        onClick={() => navigate(`/tale/${MOCK_TALE_OF_THE_DAY.id}`)}
      >
        <div className={styles.taleOfDayText}>
          <div className={styles.taleOfDayLabel}>🌟 Сказка дня</div>
          <div className={styles.taleOfDayTitle}>
            {MOCK_TALE_OF_THE_DAY.title}
          </div>
          <div className={styles.taleOfDayMeta}>
            🎧 {MOCK_TALE_OF_THE_DAY.duration}
          </div>
        </div>
        <div
          className={styles.taleOfDayPlay}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tale/${MOCK_TALE_OF_THE_DAY.id}`);
          }}
        >
          <Play className={styles.playIcon} aria-hidden />
        </div>
      </button>

      {/* Колыбельная дня — только в разделе «На ночь» */}
      {filter === "night" && (
        <>
          {canUseLullaby ? (
            <div className={styles.lullabyCard}>
              <div className={styles.taleOfDayText}>
                <div className={styles.lullabyLabel}>🌙 Колыбельная дня</div>
                <div className={styles.taleOfDayTitle}>{lullabyOfTheDay.title}</div>
                <div className={styles.taleOfDayMeta}>
                  🎧 {lullabyOfTheDay.duration} •{" "}
                  {CHARACTERS.find((c) => c.id === lullabyOfTheDay.voice)?.name ?? ""}
                </div>
              </div>
              <div className={styles.lullabyActions}>
                <button
                  type="button"
                  className={styles.deferButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSaved(lullabyOfTheDay.id)) {
                      unsaveLullaby(lullabyOfTheDay.id);
                    } else {
                      saveLullaby(lullabyOfTheDay.id);
                    }
                  }}
                >
                  <Bookmark
                    size={14}
                    style={{ fill: isSaved(lullabyOfTheDay.id) ? "currentColor" : "none" }}
                  />
                  {isSaved(lullabyOfTheDay.id) ? "В отложенных" : "Отложить"}
                </button>
                <div
                  className={styles.taleOfDayPlay}
                  onClick={() => navigate(`/tale/${lullabyOfTheDay.taleId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/tale/${lullabyOfTheDay.taleId}`);
                    }
                  }}
                >
                  <Play className={styles.playIcon} aria-hidden />
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`${styles.lullabyCard} ${styles.lullabyCardLocked}`}
              onClick={() => {
                openPaywall(
                  "Колыбельная на ночь доступна в Семейной и Премиум-подписке.",
                );
                navigate("/subscription");
              }}
            >
              <div className={styles.taleOfDayText}>
                <div className={styles.lullabyLabel}>🌙 Колыбельная дня</div>
                <div className={styles.taleOfDayTitle}>{lullabyOfTheDay.title}</div>
                <div className={styles.taleOfDayMeta}>
                  🔒 Доступна по подписке от 1199₽/мес
                </div>
              </div>
            </button>
          )}

          {savedLullabies.length > 0 && (
            <>
              <h2 className={styles.savedSectionTitle}>Отложенные колыбельные</h2>
              <div className={styles.list}>
                {savedLullabies.map((lullaby) => {
                  const character = CHARACTERS.find((c) => c.id === lullaby.voice);
                  return (
                    <button
                      key={lullaby.id}
                      type="button"
                      className={styles.card}
                      onClick={() => navigate(`/tale/${lullaby.taleId}`)}
                    >
                      <div className={styles.left}>
                        {character && (
                          <img
                            src={character.avatar}
                            alt={character.name}
                            className={styles.avatar}
                            style={{ borderColor: character.glowColor }}
                          />
                        )}
                        <div className={styles.texts}>
                          <div className={styles.cardTitle}>{lullaby.title}</div>
                          <div className={styles.cardMeta}>
                            🎧 {lullaby.duration} • {character?.name ?? ""}
                          </div>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <button
                          type="button"
                          className={styles.deferButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            unsaveLullaby(lullaby.id);
                          }}
                        >
                          Убрать
                        </button>
                        <div
                          className={styles.playButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tale/${lullaby.taleId}`);
                          }}
                        >
                          <Play className={styles.playIcon} aria-hidden />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className={styles.divider} />
        </>
      )}

      <h2 className={styles.archiveTitle}>Сказки из архива</h2>

      <div className={styles.list}>
        {filteredTales.map((tale, index) => {
          const locked = isFree && index >= visibleCount;
          const character = CHARACTERS.find((c) => c.id === tale.voice);
          return (
            <button
              key={tale.id}
              type="button"
              className={`${styles.card} ${locked ? styles.cardLocked : ""}`}
              onClick={() => {
                if (locked) {
                  openPaywall(
                    "Эта сказка доступна по подписке. Открой всю библиотеку с помощью платного плана.",
                  );
                  return;
                }
                navigate(`/tale/${tale.id}`);
              }}
            >
              <div className={styles.left}>
                {character && (
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className={styles.avatar}
                    style={{ borderColor: character.glowColor }}
                  />
                )}
                <div className={styles.texts}>
                  <div className={styles.cardTitle}>{tale.title}</div>
                  <div className={styles.cardMeta}>
                    🎧 {tale.duration} •{" "}
                    {character ? character.name : "Рассказчик"}
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                <div
                  className={styles.playButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (locked) {
                      openPaywall(
                        "Эта сказка доступна по подписке. Открой всю библиотеку с помощью платного плана.",
                      );
                      return;
                    }
                    navigate(`/tale/${tale.id}`);
                  }}
                >
                  <Play className={styles.playIcon} aria-hidden />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isFree && (
        <div className={styles.paywall}>
          <p className={styles.paywallText}>
            🔒 Остальные сказки доступны по подписке
          </p>
          <button
            type="button"
            className={styles.paywallButton}
            onClick={() => navigate("/subscription")}
          >
            Открыть все сказки — от 499₽/мес
          </button>
        </div>
      )}
    </section>
  );
}

