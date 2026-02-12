import { useState } from "react";

import styles from "./SubscriptionPage.module.css";
import { SUBSCRIPTION_PLANS } from "../../shared/api/mockData";
import { formatPrice } from "../../shared/utils/formatPrice";

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"month" | "year">("month");

  const isYear = billing === "year";

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Выбери свой план</h1>
      <p className={styles.subtitle}>Разблокируй всю магию Портала</p>

      <div className={styles.billingToggle}>
        <button
          type="button"
          className={`${styles.billingOption} ${
            !isYear ? styles.billingOptionActive : ""
          }`}
          onClick={() => setBilling("month")}
        >
          Месяц
        </button>
        <button
          type="button"
          className={`${styles.billingOption} ${
            isYear ? styles.billingOptionActive : ""
          }`}
          onClick={() => setBilling("year")}
        >
          Год −20%
        </button>
      </div>

      <div className={styles.cards}>
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isFree = plan.id === "free";
          const showYear = isYear && !isFree;
          const priceLabel = isFree
            ? "0₽"
            : !showYear
              ? `${formatPrice(plan.monthly_price)} ₽/мес`
              : `${formatPrice(plan.yearly_price)} ₽/год`;

          return (
            <article
              key={plan.id}
              className={`${styles.card} ${
                plan.highlighted ? styles.cardFamily : ""
              }`}
            >
              {plan.badge && (
                <div className={styles.badgePopular}>{plan.badge}</div>
              )}
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  {plan.emoji} {plan.name}
                </span>
                {!isFree && (
                  <span className={styles.cardPrice}>{priceLabel}</span>
                )}
                {isFree && (
                  <span className={styles.badgeCurrent}>Текущий</span>
                )}
              </div>
              {showYear && !isFree && (
                <div className={styles.savings}>
                  {formatPrice(plan.yearly_monthly)} ₽/мес • Экономия{" "}
                  {formatPrice(plan.yearly_savings)} ₽
                </div>
              )}
              <div className={styles.cardFeatures}>
                {plan.features.map((text) => (
                  <div key={text} className={styles.feature}>
                    <span className={styles.featureIconOk}>✅</span>
                    <span>{text}</span>
                  </div>
                ))}
                {plan.limitations.map((text) => (
                  <div key={text} className={styles.feature}>
                    <span className={styles.featureIconX}>❌</span>
                    <span className={styles.featureDisabled}>{text}</span>
                  </div>
                ))}
              </div>
              {!isFree && (
                <button type="button" className={styles.cardButton}>
                  Выбрать
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

