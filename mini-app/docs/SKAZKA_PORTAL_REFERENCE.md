# Референс: skazka-portal (Documents)

Папка **`/Users/anastasiakucheva/Documents/skazka-portal`** просмотрена. Ниже — что там есть и что имеет смысл перенести в mini-app.

---

## Что есть в skazka-portal

### Стек
- **Create React App** (react-scripts), React 19, TypeScript
- **React Router** v6
- **Framer Motion** — анимации и `AnimatePresence` при смене роутов
- **Zustand** — стор (в т.ч. `hasSeenOnboarding`)
- **Radix UI** — Dialog, Dropdown Menu, Tabs
- **Lucide React** — иконки
- **Tailwind CSS** — стили + свои утилиты

### Роутинг и flow (из `App.tsx`)

```
Splash (3 сек) → если !hasSeenOnboarding → Onboarding → иначе /main
/main          — главный экран
/tale-generation — генерация сказки
/narrators     — выбор рассказчиков
/subscription   — подписка
/coins         — магазин монет
/collection    — коллекция
/profile       — профиль
/tale/:id      — плеер сказки
```

Это хорошо совпадает с нашей картой экранов (Splash, Онбординг, Получить сказку, Голос, Подписка, Монеты, Коллекция, Профиль, Плеер).

### Стили (`index.css`)

- Шрифт **Nunito**
- Фон: градиент `from-blue-50 via-white to-purple-50`
- Классы:
  - `btn-primary`, `btn-secondary` — градиентные кнопки, лёгкий hover/active
  - `card-magical` — белая карточка с blur и фиолетовой обводкой
  - `gradient-text` — градиентный текст (primary → secondary)
  - `glass-effect` — полупрозрачность + blur

Идеи можно перенести в нашу дизайн-систему (у нас уже свой фон и Poppins; можно взять только кнопки/карточки/glass).

---

## Чего нет в skazka-portal

- Папок **`src/pages/`** и **`src/store/`** в репозитории нет — в `App.tsx` импортируются `SplashScreen`, `Onboarding`, `MainScreen`, `TaleGeneration`, `NarratorsSelection`, `Subscription`, `CoinsShop`, `Collection`, `Profile`, `TalePlayer` и `useStore`, но самих файлов нет. То есть реализован только **каркас приложения** (роуты + flow), без UI страниц.

---

## Что имеет смысл использовать в mini-app

| Что | Действие |
|-----|----------|
| **Flow: Splash → Onboarding → Main** | Взять за основу в `App.tsx` / роутере: сплеш, проверка «прошёл ли онбординг», редирект на главный таб. |
| **Список роутов** | Уже есть в `docs/SCREENS_AND_DESIGN.md`; можно свериться с skazka-portal и добавить недостающие (например tale/:id). |
| **Framer Motion + AnimatePresence** | Добавить в mini-app для плавных переходов между страницами и появления карточек. |
| **Zustand** | Опционально: хранить `hasSeenOnboarding`, выбранный профиль ребёнка, возможно кэш лимитов. Либо оставить React state + API. |
| **Radix UI** | Если нужны модалки/табы/dropdown без кастомной разработки — добавить в mini-app и использовать для пейволлов, табов тарифов, меню. |
| **Lucide React** | Удобные иконки; можно заменить текущие SVG в Layout на Lucide. |
| **Tailwind** | В mini-app сейчас чистый CSS (переменные, свой фон). Либо подключать Tailwind и постепенно переносить стили, либо брать только идеи классов (card-magical, btn-primary, glass) и повторить в нашем `index.css`. |
| **Стили кнопок/карточек** | Перенести концепцию (градиент, тень, rounded-xl, hover) в наши `.btn` и `.card` в `index.css`. |

---

## Рекомендация

1. **Не копировать skazka-portal целиком** — у нас Vite + своя структура; CRA и другой набор зависимостей не переносить.
2. **Взять из skazka-portal:**  
   - логику сплеша и онбординга (и флаг «онбординг пройден»);  
   - список экранов/роутов как чеклист;  
   - при желании — Framer Motion, Zustand, Radix, Lucide и переиспользовать идеи из `index.css` (кнопки, карточки, glass), адаптируя под наш дизайн и Telegram Mini App.

Когда будешь делать Splash и онбординг в mini-app, можно опираться на этот flow и при необходимости добавить в проект только нужные зависимости (например только `framer-motion` для начала).
