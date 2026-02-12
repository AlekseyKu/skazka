import { useNavigate } from "react-router-dom";

import styles from "./ErrorFallback.module.css";
import BottomNav from "./BottomNav/BottomNav";

interface ErrorFallbackProps {
  onRetry?: () => void;
}

export default function ErrorFallback({ onRetry }: ErrorFallbackProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.errorPage}>
        <div className={styles.background} />
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2>Упс, магия не сработала</h2>
          <p>Фея немного расстроена, но ты можешь это исправить!</p>
          <button
            className={styles.retryBtn}
            onClick={() => navigate("/subscription")}
          >
            Оформить подписку
          </button>
          {onRetry && (
            <button className={styles.secondaryBtn} onClick={onRetry}>
              Попробовать снова
            </button>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

