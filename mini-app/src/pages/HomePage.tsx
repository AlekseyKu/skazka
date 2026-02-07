import { useState } from "react";

import Button from "../shared/components/Button";
import Card from "../shared/components/Card";
import Input from "../shared/components/Input";
import { apiFetch } from "../shared/api/client";

export default function HomePage() {
  const [theme, setTheme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("Введите тему для сказки.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await apiFetch<{ text: string }>(
        "/api/v1/tales/generate",
        {
          method: "POST",
          body: JSON.stringify({ theme }),
        }
      );
      setResult(response.text);
    } catch {
      setError("Не удалось сгенерировать сказку.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2>Главная</h2>
      <Card>
        <p>Выберите тип сказки и создайте новую историю.</p>
        <div className="stack">
          <Input
            placeholder="Тема сказки"
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
          />
          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Генерируем..." : "Сгенерировать"}
          </Button>
          {error && <p className="text-error">{error}</p>}
        </div>
      </Card>
      {result && (
        <Card>
          <p className="text-muted">Результат</p>
          <p>{result}</p>
        </Card>
      )}
    </section>
  );
}
