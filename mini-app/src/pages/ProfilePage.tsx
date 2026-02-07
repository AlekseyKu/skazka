import Button from "../shared/components/Button";
import Card from "../shared/components/Card";
import { useAuth } from "../shared/auth/AuthContext";

export default function ProfilePage() {
  const { status, user, error, loginWithTelegram, logout } = useAuth();

  return (
    <section>
      <h2>Профиль</h2>
      <Card>
        {status === "authorized" && user ? (
          <>
            <p>Пользователь: {user.user_id}</p>
            <p>Подписка: {user.subscription}</p>
            <p>Монеты: {user.coins}</p>
            <Button variant="secondary" onClick={logout}>
              Выйти
            </Button>
          </>
        ) : (
          <>
            <p>Авторизация не выполнена.</p>
            {error && <p className="text-error">{error}</p>}
            <Button onClick={loginWithTelegram}>Подключить Telegram</Button>
          </>
        )}
      </Card>
    </section>
  );
}
