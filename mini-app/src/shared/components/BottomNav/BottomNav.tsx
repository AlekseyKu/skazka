import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Home, Library, Sparkles, User } from "lucide-react";

import styles from "./BottomNav.module.css";
import { hapticSelectionChanged } from "../../hooks/useHaptic";
import { useUser } from "../../api/useMockData";
import { useTrialStore } from "../../stores/trialStore";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useUser();
  const { freeCustomUsed, maxFreeCustom } = useTrialStore();

  const handleClick = () => {
    hapticSelectionChanged();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.item} ${isActive ? styles.itemActive : ""}`;

  const handleCreateClick = () => {
    const dailyLimit = (user as any)?.daily_limit ?? 1;
    const subscription = (user as any)?.subscription ?? "free";

    const freeTrialAvailable =
      subscription === "free" && freeCustomUsed < maxFreeCustom;

    const hasCredits =
      (dailyLimit > 0 && subscription !== "free") || freeTrialAvailable;

    if (hasCredits) {
      navigate("/create");
    } else {
      navigate("/limit");
    }
  };

  const isCreateActive = location.pathname.startsWith("/create");

  return (
    <nav className={styles.bottomNav}>
      <NavLink to="/" className={navLinkClass} onClick={handleClick}>
        <Home className={styles.icon} aria-hidden />
        <span className={styles.label}>Главная</span>
      </NavLink>
      <NavLink to="/library" className={navLinkClass} onClick={handleClick}>
        <BookOpen className={styles.icon} aria-hidden />
        <span className={styles.label}>Библиотека</span>
      </NavLink>
      <button
        type="button"
        className={`${styles.item} ${styles.center} ${
          isCreateActive ? styles.itemActive : ""
        }`}
        onClick={() => {
          handleClick();
          handleCreateClick();
        }}
      >
        <div className={styles.create}>
          <Sparkles className={styles.icon} aria-hidden />
        </div>
        <span className={styles.label}>Создать</span>
      </button>
      <NavLink
        to="/collection"
        className={navLinkClass}
        onClick={handleClick}
      >
        <Library className={styles.icon} aria-hidden />
        <span className={styles.label}>Коллекция</span>
      </NavLink>
      <NavLink to="/profile" className={navLinkClass} onClick={handleClick}>
        <User className={styles.icon} aria-hidden />
        <span className={styles.label}>Профиль</span>
      </NavLink>
    </nav>
  );
}

