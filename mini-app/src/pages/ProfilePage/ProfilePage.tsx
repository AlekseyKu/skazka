import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, User } from "lucide-react";

import styles from "./ProfilePage.module.css";
import Button from "../../shared/components/Button";
import CoinIcon from "../../shared/components/CoinIcon";
import {
  COIN_PACKAGES,
  FREE_COINS_OPTIONS,
  MOCK_REFERRAL,
  MOCK_STATS,
  MOCK_USER,
} from "../../shared/api/mockData";
import { formatPrice } from "../../shared/utils/formatPrice";
import { useUIStore } from "../../shared/stores/uiStore";
import {
  useChildrenProfilesStore,
  type ChildProfile,
} from "../../shared/stores/childrenProfilesStore";

const TOPIC_OPTIONS = [
  "🐰 Животные",
  "🏰 Приключения",
  "🤝 Дружба",
  "✨ Волшебство",
  "🌳 Природа",
  "😴 Засыпание",
  "⚔️ Герои",
];

type ChildFormData = Omit<ChildProfile, "id">;

export default function ProfilePage() {
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const [childrenOpen, setChildrenOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const children = useChildrenProfilesStore((s) => s.children);
  const addChild = useChildrenProfilesStore((s) => s.addChild);
  const updateChild = useChildrenProfilesStore((s) => s.updateChild);
  const getMaxChildren = useChildrenProfilesStore((s) => s.getMaxChildren);
  const subscription = MOCK_USER.subscription;
  const maxChildren = getMaxChildren(subscription);
  const canAddChild =
    (subscription === "family" || subscription === "premium") &&
    children.length < maxChildren;

  const [formData, setFormData] = useState<Record<string, ChildFormData>>({});
  useEffect(() => {
    setFormData((prev) => {
      const next = { ...prev };
      children.forEach((c) => {
        next[c.id] = {
          name: c.name,
          age: c.age,
          birthday: c.birthday,
          interests: [...c.interests],
        };
      });
      return next;
    });
  }, [children]);

  const setChildField = (
    id: string,
    field: keyof ChildFormData,
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveChild = (id: string) => {
    const data = formData[id];
    if (!data) return;
    updateChild(id, data);
    showToast({
      id: "child-saved",
      message: "Данные сохранены",
      type: "success",
    });
  };

  const handleAddChild = () => {
    if (!canAddChild) return;
    addChild();
    setChildrenOpen(true);
  };

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_REFERRAL.referral_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        id: "copy-failed",
        message: "Не удалось скопировать ссылку",
        type: "error",
      });
    }
  };

  const handleBuyCoins = () => {
    showToast({
      id: "payment-soon",
      message: "Оплата будет доступна после подключения ЮКассы",
      type: "info",
    });
  };

  const handleFreeCoins = (id: string) => {
    showToast({
      id: `free-${id}`,
      message: "Скоро добавим выполнение этого задания",
      type: "info",
    });
  };

  return (
    <section className={styles.root}>
      {/* Шапка пользователя */}
      <header className={styles.header}>
        <div className={styles.avatar}>
          <User className={styles.avatarIcon} aria-hidden />
        </div>
        <div className={styles.headerText}>
          <h1 className={styles.name}>{MOCK_USER.username}</h1>
          <p className={styles.status}>
            ⭐ Бесплатная • <CoinIcon size={18} /> {MOCK_USER.coins} монет
          </p>
          <p className={styles.stats}>
            📖 {MOCK_STATS.tales_count} сказки • 🎧 {MOCK_STATS.tts_minutes} мин
            прослушано
          </p>
        </div>
      </header>

      {/* Подписка */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>💫 Подписка</h2>
        <p className={styles.cardLine}>Подписка: Бесплатная</p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "100%" }} />
        </div>
        <p className={styles.cardMeta}>Сегодня: 1/1 сказка</p>
        <Button
          className={styles.primaryButton}
          onClick={() => navigate("/subscription")}
        >
          Улучшить подписку →
        </Button>
        <p className={styles.helperText}>
          От 499₽/мес — больше сказок и голосов
        </p>
      </section>

      {/* Монеты */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <CoinIcon size={24} /> Мои монеты: {MOCK_USER.coins}
        </h2>
        <div className={styles.coinsGrid}>
          {COIN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              type="button"
              className={styles.coinsPack}
              onClick={handleBuyCoins}
            >
              <div className={styles.coinsValue}>
                {pkg.coins} <CoinIcon size={20} />
              </div>
              <div className={styles.coinsPrice}>
                {formatPrice(pkg.price)}₽
              </div>
              {pkg.discount && (
                <div className={styles.coinsDiscount}>-{pkg.discount}%</div>
              )}
            </button>
          ))}
        </div>
        <p className={styles.cardSubtitle}>Бесплатные монеты:</p>
        <div className={styles.freeCoinsList}>
          {FREE_COINS_OPTIONS.slice(0, 3).map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={styles.freeCoinsItem}
              onClick={() => handleFreeCoins(opt.id)}
            >
              <span>
                {opt.icon} {opt.text}
              </span>
              <span className={styles.freeCoinsReward}>
                +{opt.reward} <CoinIcon size={18} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Профили детей */}
      <section className={styles.card}>
        <button
          type="button"
          className={styles.accordionHeader}
          onClick={() => setChildrenOpen((o) => !o)}
        >
          <span>👶 Профили детей</span>
          {childrenOpen ? (
            <ChevronUp className={styles.accordionIcon} aria-hidden />
          ) : (
            <ChevronDown className={styles.accordionIcon} aria-hidden />
          )}
        </button>
        {childrenOpen && (
          <div className={styles.childrenBody}>
            {children.map((child) => {
              const data = formData[child.id] ?? child;
              return (
                <div key={child.id} className={styles.childCard}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Имя</span>
                    <input
                      className={styles.input}
                      value={data.name}
                      onChange={(e) =>
                        setChildField(child.id, "name", e.target.value)
                      }
                      placeholder="Имя ребёнка"
                    />
                  </label>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Возраст</span>
                    <div className={styles.ageChips}>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
                        <button
                          key={a}
                          type="button"
                          className={`${styles.ageChip} ${
                            data.age === a ? styles.ageChipActive : ""
                          }`}
                          onClick={() =>
                            setChildField(child.id, "age", a)
                          }
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>День рождения</span>
                    <input
                      className={styles.input}
                      value={data.birthday}
                      onChange={(e) =>
                        setChildField(child.id, "birthday", e.target.value)
                      }
                      placeholder="ГГГГ-ММ-ДД"
                    />
                    <span className={styles.helperText}>
                      🎂 Поздравим и подарим бесплатную сказку!
                    </span>
                  </label>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Любимые темы</span>
                    <div className={styles.topicsChips}>
                      {TOPIC_OPTIONS.map((topic) => {
                        const active = data.interests.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            className={`${styles.topicChip} ${
                              active ? styles.topicChipActive : ""
                            }`}
                            onClick={() => {
                              const next = active
                                ? data.interests.filter((t) => t !== topic)
                                : [...data.interests, topic];
                              setChildField(child.id, "interests", next);
                            }}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button
                    className={styles.secondaryButton}
                    onClick={() => handleSaveChild(child.id)}
                  >
                    Сохранить
                  </Button>
                </div>
              );
            })}

            {canAddChild ? (
              <button
                type="button"
                className={styles.addChildButton}
                onClick={handleAddChild}
              >
                + Добавить ребёнка
              </button>
            ) : (
              <p className={styles.helperText}>
                {children.length >= maxChildren
                  ? `На вашем тарифе доступно до ${maxChildren} ${maxChildren === 1 ? "профиля" : "профилей"}.`
                  : "Дополнительные профили доступны в Семейной (до 3) и Премиум (до 5) подписках."}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Серия */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>🔥 Серия</h2>
        <p className={styles.cardLine}>
          7 дней подряд • до следующей награды: 7/14 → +5{" "}
          <CoinIcon size={18} />
        </p>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "50%" }} />
        </div>
      </section>

      {/* Пригласи друга */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>👥 Пригласи друга</h2>
        <p className={styles.cardLine}>
          Приглашено: {MOCK_REFERRAL.friends_invited} • Заработано:{" "}
          <CoinIcon size={18} /> {MOCK_REFERRAL.coins_earned}
        </p>
        <p className={styles.referralLink}>
          {MOCK_REFERRAL.referral_link.replace(
            "https://",
            "",
          )}
        </p>
        <div className={styles.referralActions}>
          <button
            type="button"
            className={styles.referralButton}
            onClick={handleCopyReferral}
          >
            {copied ? "Скопировано ✓" : "Копировать"}
          </button>
          <button
            type="button"
            className={styles.referralButtonSecondary}
            onClick={() =>
              showToast({
                id: "share-ref",
                message: "Скоро можно будет поделиться ссылкой",
                type: "info",
              })
            }
          >
            Поделиться
          </button>
        </div>
      </section>

      {/* Ещё */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Ещё</h2>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/rewards")}
        >
          <span>🏆 Награды и бонусы</span>
        </button>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/help")}
        >
          <span>❓ Помощь и поддержка</span>
        </button>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/terms")}
        >
          <span>📋 Условия использования</span>
        </button>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() => navigate("/privacy")}
        >
          <span>🔒 Политика конфиденциальности</span>
        </button>
        <button
          type="button"
          className={styles.menuItem}
          onClick={() =>
            showToast({
              id: "delete-account",
              message: "Напишите в поддержку",
              type: "info",
            })
          }
        >
          <span>🗑 Удалить аккаунт</span>
        </button>
        <p className={styles.version}>ℹ О приложении — v1.0</p>
      </section>
    </section>
  );
}

