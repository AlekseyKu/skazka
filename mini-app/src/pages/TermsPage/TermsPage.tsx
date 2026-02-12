import styles from "./TermsPage.module.css";

export default function TermsPage() {
  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Условия использования</h1>
      <p className={styles.text}>
        Здесь будет краткая версия пользовательского соглашения Портала в Сказку.
        Для MVP достаточно текста-заглушки. Полный юридический текст можно будет
        подгружать из отдельного файла или ссылки позже.
      </p>
    </section>
  );
}

