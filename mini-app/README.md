# Mini App — Портал в Сказку

Фронтенд Telegram Mini App для проекта «Портал в Сказку»: React, TypeScript, Vite.

## Архитектура проекта

В репозитории **skazka** есть бэкенд (API, бот, БД) и фронтенд — эта папка **mini-app**. В этой разработке участвует только mini-app.

**Общая схема репозитория:**

```
skazka/
├── api/          # Backend API
├── bot/          # Telegram-бот
├── core/         # Ядро (AI, TTS)
├── db/           # База данных
└── mini-app/     # ← этот фронтенд (Telegram Mini App)
```

**Структура mini-app:**

```
mini-app/
├── src/
│   ├── app/              # Роутинг и React Query
│   │   ├── queryClient.ts
│   │   └── router.tsx
│   ├── pages/            # Страницы приложения
│   │   ├── HomePage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   ├── shared/
│   │   ├── api/          # API-клиент
│   │   ├── auth/         # AuthContext, ProtectedRoute
│   │   ├── components/   # Button, Card, Input, Layout
│   │   └── hooks/        # useTelegram и др.
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── docs/                 # Документация (карта экранов, дизайн)
├── tsconfig.json
└── Dockerfile
```

## Дизайн и экраны

Полная карта экранов, MVP (Фаза 1) и принципы «вау»-дизайна — в **[docs/SCREENS_AND_DESIGN.md](docs/SCREENS_AND_DESIGN.md)**. Референс по проекту из папки **skazka-portal** (Documents) — что взять в mini-app — в **[docs/SKAZKA_PORTAL_REFERENCE.md](docs/SKAZKA_PORTAL_REFERENCE.md)**.

## Mini App

- **Стек:** Vite, React, TypeScript.
- **Запуск (локально):** `npm install` → `npm run dev` (обычно http://localhost:5173).
- **В проде:** собирается в Docker; в dev-среде поднимается вместе с API: `docker compose -f docker-compose.dev.yml up -d --build` (из корня репо). Mini App доступен по http://localhost:5173.

### Работа только с mini-app (sparse-checkout)

Если в клоне нужна только эта папка:

```bash
git clone <repo-url>
cd skazka
git sparse-checkout init --cone
git sparse-checkout set mini-app
```

Дальше работа и пуш как обычно (коммиты в ветки репозитория, в коммитах — изменения в `mini-app/`).
