import styles from "./PrivacyPage.module.css";

export default function PrivacyPage() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Политика конфиденциальности</h1>
      <p className={styles.text}>
        Здесь будет краткое описание того, как мы обращаемся с данными
        пользователя в мини-приложении. Подробная юридическая версия может быть
        добавлена позже.
      </p>
    </section>
  );
}

