import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import styles from "./HelpPage.module.css";
import Button from "../../shared/components/Button";
import { useUIStore } from "../../shared/stores/uiStore";

const FAQ_ITEMS = [
  {
    id: "create",
    question: "Как создать сказку?",
    answer:
      "Нажми «Создать» в нижнем меню, выбери тему и голос рассказчика. Через несколько секунд сказка будет готова! На бесплатном тарифе доступна 1 сказка в день в первые 3 дня.",
  },
  {
    id: "subscription",
    question: "Что входит в подписку?",
    answer:
      "Подписка открывает больше сказок, дополнительных голосов и возможность создавать именные сказки. Подробности — в разделе Профиль → Подписка.",
  },
  {
    id: "coins",
    question: "Как работают монеты?",
    answer:
      "Монеты — волшебная валюта Портала. За них можно покупать дополнительные сказки сверх лимита. Монеты можно купить или заработать: пригласи друга, слушай сказки каждый день, напиши отзыв.",
  },
  {
    id: "offline",
    question: "Можно ли слушать без интернета?",
    answer:
      "Скачанные сказки из коллекции доступны в офлайн-режиме прямо в мини-приложении. Эта функция появится в ближайшем обновлении.",
  },
  {
    id: "support",
    question: "Как связаться с поддержкой?",
    answer:
      "Напиши нашему боту поддержки: @fairytale_portal_support_bot — мы ответим в течение 24 часов.",
  },
];

export default function HelpPage() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const showToast = useUIStore((s) => s.showToast);

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Помощь и поддержка</h1>
      <p className={styles.subtitle}>
        Отвечаем на частые вопросы о Портале
      </p>

      <div className={styles.accordion}>
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className={styles.chevron} aria-hidden />
                ) : (
                  <ChevronDown className={styles.chevron} aria-hidden />
                )}
              </button>
              {isOpen && (
                <div className={styles.answerWrapper}>
                  <p className={styles.answer}>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className={styles.footer}
        onClick={() =>
          showToast({
            id: "support",
            message:
              "Откройте @fairytale_portal_support_bot в Telegram, чтобы написать в поддержку",
            type: "info",
          })
        }
      >
        💬 Написать в поддержку
      </Button>

      <p className={styles.footer}>
        Наш бот поддержки:{" "}
        <span className={styles.link}>@fairytale_portal_support_bot</span>
      </p>
    </section>
  );
}

