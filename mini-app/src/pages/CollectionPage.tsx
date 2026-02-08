import { useQuery } from "@tanstack/react-query";

import Card from "../shared/components/Card";
import { apiFetch } from "../shared/api/client";
import { useAuth } from "../shared/auth/AuthContext";

type CollectionItem = {
  id: number;
  text: string;
  audio_path: string | null;
  type: string;
  date: string;
  is_favorite: boolean;
};

export default function CollectionPage() {
  const { status } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ["collection"],
    queryFn: () => apiFetch<CollectionItem[]>("/api/v1/collection"),
    enabled: status === "authorized",
  });

  return (
    <section>
      <h2>Коллекция</h2>
      {status !== "authorized" ? (
        <p>Нужна авторизация через Telegram.</p>
      ) : isLoading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p className="text-error">Ошибка загрузки коллекции</p>
      ) : data && data.length > 0 ? (
        <div className="stack">
          {data.map((item) => (
            <Card key={item.id}>
              <p className="text-muted">{item.type}</p>
              <p>{item.text.slice(0, 160)}...</p>
            </Card>
          ))}
        </div>
      ) : (
        <p>Пока нет сказок в коллекции.</p>
      )}
    </section>
  );
}
