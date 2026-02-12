import styles from "./RewardsPage.module.css";
import { MOCK_REFERRAL, MOCK_STATS } from "../../shared/api/mockData";
import CoinIcon from "../../shared/components/CoinIcon";

export default function RewardsPage() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Награды и бонусы</h1>
      <p className={styles.subtitle}>
        Здесь собирается вся магия, которую ты уже заработала.
      </p>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>🔥 Серия дней</h2>
        <p className={styles.cardLine}>
          Текущая серия: {MOCK_STATS.streak_days} дней подряд
        </p>
        <p className={styles.cardMeta}>
          Следующая награда: {MOCK_STATS.streak_next_reward} дней → +
          {MOCK_STATS.streak_reward_coins} <CoinIcon size={18} />
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>👥 Друзья</h2>
        <p className={styles.cardLine}>
          Приглашено друзей: {MOCK_REFERRAL.friends_invited}
        </p>
        <p className={styles.cardMeta}>
          Заработано: {MOCK_REFERRAL.coins_earned} <CoinIcon size={18} />
        </p>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>🎁 Задания на монеты</h2>
        <ul className={styles.tasks}>
          <li>Пригласи друга — +3 монеты</li>
          <li>7 дней подряд — +2 монеты</li>
          <li>Напиши отзыв — +5 монет</li>
        </ul>
      </section>
    </section>
  );
}

