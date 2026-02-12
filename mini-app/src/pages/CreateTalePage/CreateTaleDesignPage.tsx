import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";

import styles from "./CreateTalePage.module.css";
import Button from "../../shared/components/Button";
import {
  CHARACTERS,
  canUseCharacter,
  AVAILABLE_FROM_LABEL,
} from "../../shared/api/mockData";
import { useUser } from "../../shared/api/useMockData";
import { useUIStore } from "../../shared/stores/uiStore";
import { useOnboardingStore } from "../../shared/stores/onboardingStore";

const TOPICS = [
  "🤝 Дружба",
  "⚔️ Добро и зло",
  "🌟 Смелость",
  "🐻 Животные",
  "✨ Волшебство",
  "🌙 Засыпание",
  "🏰 Приключения",
] as const;

const VOICE_PREVIEW: Record<string, string> = {
  bayun: "Мурр... Я кот Баюн, готов рассказать тебе сказку",
  leshiy: "Шшш... Я Леший, знаю все тайны дремучего леса",
  rusalka: "Я Русалка, мой голос нежнее лунного света",
  dobrynya: "Я Добрыня Никитич! Слушай историю о подвигах!",
};

export default function CreateTaleDesignPage() {
  const { data: user } = useUser();
  const subscription =
    (user as { subscription?: string })?.subscription ?? "free";
  const showToast = useUIStore((s) => s.showToast);
  const childName = useOnboardingStore((s) => s.childName);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState<string>("bayun");
  const maxChars = 200;

  const remainingText = text.slice(0, maxChars);
  const isDisabled = !remainingText.trim();

  const isLocked = (availableFrom: string) =>
    !canUseCharacter(subscription, availableFrom);
  const getLockLabel = (availableFrom: string) =>
    AVAILABLE_FROM_LABEL[availableFrom] ?? "";

  const handlePreview = (id: string) => {
    const message = VOICE_PREVIEW[id];
    if (message) {
      showToast({ id: `voice-${id}`, message, type: "info" });
    }
  };

  const handleTopicClick = (topic: string) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
      setText("");
    } else {
      setSelectedTopic(topic);
      setText(topic);
    }
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.target.value.slice(0, maxChars);
    setText(value);
    if (!value) setSelectedTopic(null);
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.content}>
        <h1 className={styles.title}>О чём расскажем сегодня?</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Выбери тему</h2>
          <div className={styles.chips}>
            {TOPICS.map((topic) => {
              const isActive = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  className={`${styles.chip} ${
                    isActive ? styles.chipActive : ""
                  }`}
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.labelRow}>
            <span className={styles.sectionLabel}>Или придумай свою тему:</span>
            <span className={styles.counter}>
              {remainingText.length}/{maxChars}
            </span>
          </div>
          <textarea
            className={styles.textarea}
            rows={2}
            maxLength={maxChars}
            placeholder={
              childName
                ? `Про приключения ${childName} в волшебном лесу...`
                : "Про храброго котёнка, который спас лес..."
            }
            value={remainingText}
            onChange={handleTextChange}
          />
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Выбери рассказчика</h2>
          <div className={styles.charactersRow}>
            {CHARACTERS.map((char) => {
              const locked = isLocked(char.availableFrom);
              const isActive = voiceId === char.id;
              const lockLabel = getLockLabel(char.availableFrom);
              return (
                <button
                  key={char.id}
                  type="button"
                  className={`${styles.characterCard} ${
                    isActive ? styles.characterActive : ""
                  } ${locked ? styles.characterLocked : ""}`}
                  onClick={() => {
                    if (locked) {
                      navigate("/subscription");
                      return;
                    }
                    setVoiceId(char.id);
                  }}
                >
                  <div className={styles.characterAvatarWrapper}>
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className={styles.characterAvatar}
                    />
                    {locked && (
                      <div className={styles.lockOverlay}>
                        <span className={styles.lockIcon}>🔒</span>
                        <span className={styles.lockText}>{lockLabel}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className={styles.previewButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(char.id);
                      }}
                      aria-label={`Прослушать голос ${char.name}`}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <span className={styles.characterName}>{char.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.stickyButton}>
          <Button className={styles.cta} disabled={isDisabled}>
            ✨ Создать сказку
          </Button>
        </div>
      </div>
    </section>
  );
}
