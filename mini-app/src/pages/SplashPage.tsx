import "../styles/variables.css";
import "../styles/animations.css";

/**
 * Экран загрузки приложения (Splash).
 * Фон — волшебный лес с феей и магическим вихрем.
 * Текст: «Погружаем в магию…» — создаёт ощущение процесса и ожидания.
 */
export default function SplashPage() {
  return (
    <div className="splash">
      <div className="splash__bg" aria-hidden />
      <div className="splash__overlay" aria-hidden />
      <div className="splash__content">
        <p className="splash__text">Погружаем в магию…</p>
        <div className="splash__loader" aria-hidden />
      </div>
    </div>
  );
}
