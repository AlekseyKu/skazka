import { useNavigate } from "react-router-dom";

import styles from "./LimitReachedPage.module.css";
import Button from "../../shared/components/Button";

export default function LimitReachedPage() {
  const navigate = useNavigate();

  return (
    <section className={styles.page}>
      <div className={styles.pageBackground} aria-hidden />
      <div className={styles.overlay} aria-hidden />
      <div className={styles.content}>
        <h1 className={styles.title}>Магия на сегодня иссякла</h1>
        <p className={styles.subtitle}>
          Ты использовала все доступные сказки на сегодня. Завтра лимит обновится,
          а пока можно открыть ещё больше магии с подпиской.
        </p>
        <Button
          className={styles.button}
          onClick={() => navigate("/subscription")}
        >
          Смотреть подписки
        </Button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => navigate("/")}
        >
          Вернуться на главную
        </button>
      </div>
    </section>
  );
}

