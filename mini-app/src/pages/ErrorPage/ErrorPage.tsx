import { useNavigate } from "react-router-dom";

import styles from "./ErrorPage.module.css";
import Button from "../../shared/components/Button";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <section className={styles.root}>
      <h1 className={styles.title}>Упс, что-то пошло не так</h1>
      <p className={styles.subtitle}>Магия слегка рассыпалась. Попробуем ещё раз?</p>
      <Button className={styles.button} onClick={() => navigate("/")}>
        Вернуть магию
      </Button>
    </section>
  );
}

