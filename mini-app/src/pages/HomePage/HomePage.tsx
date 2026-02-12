import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/Button";
import CoinIcon from "../../shared/components/CoinIcon";
import { useUser } from "../../shared/api/useMockData";
import styles from "./HomePage.module.css";
import { useOnboardingStore } from "../../shared/stores/onboardingStore";
import { useTrialStore } from "../../shared/stores/trialStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const childName = useOnboardingStore((s) => s.childName);
  const { freeCustomUsed, maxFreeCustom } = useTrialStore();

  const subscriptionLabels: Record<string, string> = {
    free: "Бесплатная",
    gold: "Золотая",
    family: "Семейная",
    premium: "Премиум",
  };

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.balanceBadge}>
        <CoinIcon size={18} /> {user.coins} монет • ⭐{" "}
        {subscriptionLabels[user.subscription] ?? "Бесплатная"}
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Мурр... Добро пожаловать!</h1>
        <p className={styles.subtitle}>
          Я — кот Баюн, хранитель Портала. Здесь рождаются волшебные истории
          для твоего ребёнка
          {childName ? `, ${childName}` : ""}.
        </p>
        <Button
          className={styles.cta}
          onClick={() => {
            const dailyLimit = (user as any)?.daily_limit ?? 1;
            const subscription = (user as any)?.subscription ?? "free";

            const freeTrialAvailable =
              subscription === "free" && freeCustomUsed < maxFreeCustom;

            if ((dailyLimit > 0 && subscription !== "free") || freeTrialAvailable) {
              navigate("/create");
            } else {
              navigate("/tale-of-the-day");
            }
          }}
        >
          ✨ Создать сказку
        </Button>

      </div>
    </section>
  );
}

