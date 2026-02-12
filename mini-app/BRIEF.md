ТЕХНИЧЕСКИЙ БРИФ: MINI APP «ПОРТАЛ В СКАЗКУ»
Версия: 1.0
 Дата: 2026-02-09
 Назначение: Инструкция для Cursor AI — фронтенд-разработка Telegram Mini App
 Репозиторий: github.com/AlekseyKu/skazka → папка mini-app/

1. ОБЗОР ПРОЕКТА
Название: Портал в Сказку (Mini App)
Elevator pitch: Telegram Mini App — визуальный интерфейс для сервиса персонализированных AI-аудиосказок. Родитель вводит тему, выбирает голос фольклорного персонажа, получает текст и аудио прямо внутри WebView с кастомным аудиоплеером.
Целевая аудитория: Родители детей 3–8 лет (80% женщины, 25–40 лет), РФ, средний доход+.
Ключевая метрика успеха: Конверсия FREE → Paid > 15% в первые 30 дней после запуска Mini App.
Разграничение ответственности Бот ↔ Mini App:
Бот (aiogram) отвечает за: онбординг-нарратив от Кота Баюна (первые 3 дня), push-уведомления о streak/лимитах/ДР ребёнка, сервисные сообщения (оплата прошла, подписка истекает), deep-link t.me/FairyTalePortalBot/app для открытия Mini App.
Mini App отвечает за: весь пользовательский интерфейс после онбординга — главный экран с персонажами, создание сказки (ввод темы + выбор голоса), кастомный аудиоплеер, чтение текстовых сказок, коллекция/архив, профиль с данными ребёнка, магазин подписок и монет, выбор голоса и управление тарифом.

2. ПОЛЬЗОВАТЕЛЬСКИЕ СЦЕНАРИИ (User Flows)
Сценарий 1: Первый вход в Mini App (после онбординга в боте)
Триггер: Пользователь нажимает кнопку «Открыть Портал» в боте (или inline-кнопку WebApp) после прохождения 3-дневного триала в чате.
Шаги:
Mini App открывается → @twa-dev/sdk инициализируется → извлекается initData
POST /api/v1/auth/telegram с init_data → получаем access_token + refresh_token + UserRead
Если UserRead.subscription === "free" и у пользователя нет профиля ребёнка → показываем экран «Создать профиль ребёнка» (имя + возраст)
Если профиль ребёнка уже есть → HomeScreen с персонажами и рекомендациями
Токены сохраняются в memory (не localStorage — безопасность TWA)
Успешный исход: Пользователь видит HomeScreen с аватарами 4 персонажей, своим балансом монет, статусом подписки и кнопкой «Создать сказку».
Ошибочные состояния:
initData невалидна (HMAC не прошёл) → экран «Откройте приложение через Telegram» с кнопкой закрытия Mini App через WebApp.close()
Сервер недоступен (503) → экран «Магия временно спит» с иллюстрацией спящего Баюна и кнопкой «Попробовать снова» (retry через 5 сек автоматически)
Токен истёк при навигации → автоматический silent refresh через /api/v1/auth/refresh, если refresh тоже истёк → повторная авторизация через initData
Сценарий 2: Создание кастомной аудиосказки
Триггер: Нажатие на центральную кнопку «Создать сказку» в навигации или на карточку персонажа на HomeScreen.
Шаги:
Экран CreateTaleScreen → поле ввода темы + быстрые чипсы («Про медвежонка», «Про звёзды», «Про радугу», «Про хитрую лисичку»)
Выбор голоса → горизонтальный скролл карточек персонажей (Баюн доступен всем, остальные с замком или доступны по тарифу). При тапе на заблокированный голос → Bottom Sheet с предложением upgrade или разблокировки за монеты
Чекбокс «Озвучить сказку» (по умолчанию включён, если есть лимит аудио)
Нажатие MainButton «Создать сказку» → HapticFeedback.impactOccurred(‘medium’)
LoadingScreen с анимацией (частицы летят к порталу) → POST /api/v1/tales/generate с { theme, with_audio: true }
Получен результат → TalePlayerScreen с текстом + аудиоплеером
Автоматическое сохранение в коллекцию
Успешный исход: Пользователь слушает сказку через кастомный аудиоплеер, видит текст с автоскроллом, может добавить в избранное.
Ошибочные состояния:
Лимит исчерпан → PaywallSheet снизу: «Лимит исчерпан (30/30). Купи за 3 монеты или оформи подписку»
Генерация упала (500) → экран «Волшебство не сработало» с кнопками «Попробовать снова» / «Выбрать из архива»
Таймаут генерации (>30 сек) → показать прогресс «Кот Баюн сочиняет…» с возможностью отмены и возврата на Home
Сценарий 3: Прослушивание сказки из коллекции
Триггер: Переход на вкладку «Коллекция» в нижней навигации → тап на карточку сказки.
Шаги:
CollectionScreen → список карточек сказок (название, тип, дата, аватар голоса, иконка избранного)
Тап на карточку → TalePlayerScreen
Если аудио есть → плеер с play/pause, seekbar, текущее время/длительность, кнопка скорости (1x / 1.5x / 2x)
Если аудио нет (текстовая сказка) → экран чтения с кнопкой «Озвучить за 3 монеты»
Успешный исход: Пользователь переслушивает/перечитывает сказку.
Ошибочные состояния:
Аудиофайл недоступен (404 на CDN) → «Аудио временно недоступно» + предложение перегенерировать
Коллекция пуста → EmptyState с иллюстрацией Баюна и CTA «Создать первую сказку»
Сценарий 4: Покупка подписки
Триггер: Нажатие «Подписка» в профиле, или любой paywall при исчерпании лимита.
Шаги:
SubscriptionScreen → 3 карточки тарифов (Золотая / Семейная / Премиум) с описанием фич
Тап на тариф → детальный BottomSheet с полным описанием
Кнопка «Оформить» → POST /api/v1/payments/create → redirect на ЮКассу (external link через WebApp.openLink())
После оплаты → return в Mini App через deep-link t.me/FairyTalePortalBot/app?startapp=payment_success
Mini App перезапрашивает /api/v1/users/me → обновляет состояние подписки в UI
Успешный исход: Подписка активна, UI обновился (новые голоса разблокированы, лимиты расширены).
Ошибочные состояния:
Оплата отменена → пользователь возвращается в Mini App, ничего не меняется
Webhook от ЮКассы не дошёл (подписка не активировалась) → экран «Оплата обрабатывается, обычно это занимает до 5 минут» + кнопка «Проверить статус» (повторный запрос /api/v1/users/me)
Сценарий 5: Покупка монет
Триггер: Нажатие «Монеты» в профиле, или любой paywall с опцией «Купить за N монет».
Шаги:
CoinsScreen → 4 пакета (Мини 3шт/36₽, Стандарт 10шт/99₽, Большой 25шт/199₽, Мега 50шт/349₽ — Мега показывается только пользователям с >10 потраченными монетами)
Тап на пакет → подтверждение через нативный WebApp.showPopup()
Оплата через ЮКассу (аналогично подписке)
Баланс обновляется в UI
Успешный исход: Монеты зачислены, баланс в хедере обновлён.
Сценарий 6: Создание / редактирование профиля ребёнка
Триггер: Первый вход (если нет профиля), или тап «Профиль ребёнка» в настройках.
Шаги:
ChildProfileScreen → поле «Имя ребёнка» + выбор возраста (3–10, кнопки-чипсы) + дата рождения (опционально)
Сохранение → данные уходят на бэкенд (эндпоинт нужно добавить в API — см. раздел 4)
Возврат на HomeScreen с персонализированным приветствием
Успешный исход: Профиль сохранён, сказки генерируются с именем ребёнка.

3. ЭКРАНЫ И КОМПОНЕНТЫ
3.1 HomeScreen (route: /)
Layout:
┌──────────────────────────────────────┐
│ [Status Bar — safe area inset top]   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     ФОНОВОЕ ИЗОБРАЖЕНИЕ       │  │
│  │    (портал с Баюном)           │  │
│  │                                │  │
│  │   «Привет, [имя родителя]!»   │  │
│  │   🪙 12 монет  ⭐ Золотая     │  │
│  │                                │  │
│  │   ┌──────────────────────┐    │  │
│  │   │  СОЗДАТЬ СКАЗКУ 📖  │    │  │
│  │   └──────────────────────┘    │  │
│  └────────────────────────────────┘  │
│                                      │
│  «Выбери рассказчика»               │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Баюн │ │Леший│ │Русал│ │Добр │   │
│  │ 🐾  │ │ 🌲🔒│ │🧜🔒│ │🛡🔒│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│       ← горизонтальный скролл →      │
│                                      │
│  «Рекомендуем сегодня»              │
│  ┌──────────────────────────────┐   │
│  │ 📖 Маша и медвежонок         │   │
│  │ 🎧 3:12  ⭐ 4.8              │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 📖 Лесные приключения        │   │
│  │ 🎧 4:01  ⭐ 4.6              │   │
│  └──────────────────────────────┘   │
│                                      │
│  [BottomNav: Home | Создать | Коллекция | Профиль]
│  [Safe area inset bottom]            │
└──────────────────────────────────────┘

Компоненты и состояния:
HeroSection — фоновое изображение (портал с Баюном VT60eKzJ), поверх него — приветствие, баланс монет, статус подписки, CTA-кнопка.
Loading: shimmer-плейсхолдер на месте имени и баланса (120x16px, 80x16px)
Filled: имя из UserRead, баланс из UserRead.coins, бейдж подписки
Error: fallback «Добро пожаловать!» без персональных данных
CharacterCarousel — горизонтальный скролл аватаров персонажей (64x64px круглые).
Баюн всегда unlocked (зелёная рамка glow)
Леший/Русалка — unlocked при Семейной+ подписке, иначе замок + полупрозрачность (opacity: 0.5)
Добрыня — unlocked при Премиум, иначе замок
Тап на unlocked → переход на CreateTaleScreen с предвыбранным голосом
Тап на locked → BottomSheet с описанием голоса + кнопки «Открыть на 1 день за 2🪙» / «Оформить подписку»
HapticFeedback: selectionChanged() при тапе на любую карточку
RecommendationList — вертикальный список карточек рекомендованных сказок.
Loading: 3 shimmer-карточки (высота 80px каждая)
Empty: «Создай первую сказку — и мы подберём тебе ещё!»
Filled: карточки с названием, аватаром голоса, длительностью, рейтингом
Тап → TalePlayerScreen
Анимации:
Hero section: fade-in 400ms ease-out при монтировании, контент с translateY(30px) → translateY(0)
Карточки персонажей: stagger animation, каждый следующий с задержкой 80ms, scale(0.8) + opacity(0) → scale(1) + opacity(1), duration 300ms, ease: cubic-bezier(0.34, 1.56, 0.64, 1) (spring overshoot)
Рекомендации: fade-in снизу, stagger 60ms, translateY(20px) → translateY(0), duration 350ms
Telegram-нативные элементы:
BackButton: скрыт на HomeScreen (это корневой экран)
MainButton: скрыт на HomeScreen
При входе: WebApp.setHeaderColor → #1c1b33 (–bg-2)
При входе: WebApp.setBackgroundColor → #1c1b33
3.2 CreateTaleScreen (route: /create)
Layout:
┌──────────────────────────────────────┐
│ ← Назад            Создать сказку    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Фон: дремучий лес (XjOjnGhv)  │  │
│  │                                │  │
│  │  «О чём расскажем сегодня?»   │  │
│  │                                │  │
│  │  ┌──────────────────────────┐ │  │
│  │  │ Введите тему сказки...   │ │  │
│  │  └──────────────────────────┘ │  │
│  │                                │  │
│  │  [🐻 Медвежонок] [🌟 Звёзды] │  │
│  │  [🌈 Радуга] [🦊 Лисичка]    │  │
│  │  [🐉 Дракон] [🚀 Космос]     │  │
│  └────────────────────────────────┘  │
│                                      │
│  «Выбери голос»                      │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Баюн │ │Леший│ │Русал│ │Добр │   │
│  │ ✓   │ │ 🔒  │ │ 🔒  │ │ 🔒  │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                      │
│  ☑ Озвучить (осталось 18 из 30)     │
│                                      │
│  [====== MAINBUTTON: Создать ======] │
└──────────────────────────────────────┘

Компоненты и состояния:
ThemeInput — textarea, max 200 символов, border glow при фокусе (#c159ec, transition 200ms).
Empty: placeholder «Про храброго котёнка, который спас лес…»
Filled: текст + счётчик символов (200 - current) справа снизу
Error: красная рамка + текст «Введите тему сказки» под полем
QuickThemeChips — flex-wrap контейнер с чипсами-кнопками.
Тап → заполняет ThemeInput текстом чипса
HapticFeedback: impactOccurred('light') при тапе
VoiceSelector — горизонтальный скролл карточек голосов (переиспользуем CharacterCarousel, но с radio-поведением — выбран только один).
Selected: толстая рамка gradient (primary-1 → primary-2), scale(1.05)
Locked: overlay с иконкой замка, тап → BottomSheet
AudioToggle — кастомный чекбокс «Озвучить» + прогресс лимита.
Если аудиолимит = 0 и монет < 3 → disabled + текст «Лимит исчерпан»
Если аудиолимит = 0 но монеты >= 3 → enabled + текст «Озвучить за 3🪙»
Анимации:
Вход экрана: slide-in from right, 300ms, ease-out
Чипсы при тапе: scale(0.95) → scale(1), 150ms
VoiceSelector selected: border width 0 → 3px + glow box-shadow 0 0 12px rgba(193, 89, 236, 0.5), 200ms
Telegram-нативные элементы:
BackButton: видим, при нажатии → router.navigate('/'), HapticFeedback impactOccurred('light')
MainButton: текст «✨ Создать сказку», color #c159ec, textColor #ffffff. Disabled, пока theme.trim() === ‘’. При нажатии → отправка запроса
3.3 TaleGenerationScreen (route: /create/loading)
Layout:
┌──────────────────────────────────────┐
│                                      │
│         [Фон: портал kc9KMXdc]       │
│                                      │
│          ✨ Магия плетётся...         │
│                                      │
│         [Анимация: частицы           │
│          летят к центру портала,     │
│          пульсирующий glow]          │
│                                      │
│         «Кот Баюн сочиняет          │
│          историю для Маши...»        │
│                                      │
│         [Прогресс-индикатор:         │
│          пульсирующие точки]         │
│                                      │
│                                      │
│  [Отменить]                          │
└──────────────────────────────────────┘

Компоненты:
PortalAnimation — CSS-анимация пульсации по фону портала.
Glow эффект: box-shadow пульсация 0 0 40px → 0 0 80px rgba(193, 89, 236, 0.3), 2s infinite ease-in-out
Particle effect: 12 маленьких точек (4x4px, белые, opacity: 0.4–0.8) движутся по спирали к центру, CSS keyframes, каждая со своим delay
StatusText — сменяющиеся фразы каждые 4 секунды: «Кот Баюн подбирает слова…» → «Волшебство почти готово…» → «Осталось совсем чуть-чуть…». Смена через fade-out 200ms → fade-in 200ms.
Анимации:
Весь экран: fade-in 300ms
При получении результата: портал «раскрывается» — scale(1) → scale(1.3) + opacity(1) → opacity(0), 500ms, после чего монтируется TalePlayerScreen
Telegram-нативные элементы:
BackButton: скрыт
MainButton: скрыт
3.4 TalePlayerScreen (route: /tale/:id)
Layout:
┌──────────────────────────────────────┐
│ ← Назад                    ♡ ⋯      │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Фон: мягкий лес (XjqgQ2Gn)   │  │
│  │                                │  │
│  │    [Аватар персонажа 80x80]    │  │
│  │     «Кот Баюн рассказывает»   │  │
│  │                                │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │    НАЗВАНИЕ СКАЗКИ       │  │  │
│  │  │    «Маша и медвежонок    │  │  │
│  │  │     в волшебном лесу»    │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🔈  advancement bar            │  │
│  │  ●━━━━━━━━━━━━━━━━━━━━━━━━○   │  │
│  │  01:23              03:12      │  │
│  │                                │  │
│  │      ⏪15   ▶ PLAY   15⏩     │  │
│  │                                │  │
│  │        [1x]   [♡]   [↓]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  📖 Текст сказки               │  │
│  │  (скроллится, автоскролл       │  │
│  │   синхронизирован с аудио)     │  │
│  │                                │  │
│  │  Жил-был котёнок по имени     │  │
│  │  Маша. Однажды утром...       │  │
│  │  ...                           │  │
│  └────────────────────────────────┘  │
│                                      │
│  [BottomNav]                         │
└──────────────────────────────────────┘

Компоненты и состояния:
AudioPlayer — кастомный HTML5 audio player.
Loading: shimmer на месте seekbar + disabled кнопки
Playing: seekbar заполняется, кнопка ▶ → ⏸, время обновляется каждые 250ms
Paused: кнопка ⏸ → ▶
Error: «Аудио недоступно» + кнопка retry
Buffering: пульсирующая иконка загрузки вместо кнопки play
Элементы: кнопка play/pause (56x56px, gradient background), seekbar (custom range input, трек: rgba(255,255,255,0.2), заполнение: gradient primary-1 → primary-2, thumb: 16x16 белый круг с тенью), текущее время / длительность (font-variant-numeric: tabular-nums), кнопки ±15 сек (40x40px), кнопка скорости 1x/1.5x/2x (32x32 pill), кнопка избранное (♡ → ♥, заливка #c159ec), кнопка скачать MP3 (для платных тарифов, иначе скрыта)
HapticFeedback: impactOccurred('light') при play/pause, selectionChanged() при seek
TaleText — скроллируемый блок текста сказки.
Шрифт: 16px/1.6, цвет var(–text)
При воспроизведении аудио: автоскролл (опциональный, включается тумблером). Приблизительная синхронизация: делим текст на абзацы, равномерно распределяем по длительности аудио
Без аудио: просто текст для чтения
Анимации:
Вход: slide-up from bottom 400ms cubic-bezier(0.34, 1.56, 0.64, 1)
Play button при тапе: scale(0.9) → scale(1), 150ms
Кнопка избранного: при добавлении — scale(1) → scale(1.3) → scale(1), 300ms + цвет fill → #c159ec
Telegram-нативные элементы:
BackButton: видим, возврат на предыдущий экран
MainButton: скрыт
Трёхточие (⋯) → WebApp.showPopup() с действиями: «Поделиться», «Озвучить другим голосом» (если платный), «Удалить»
3.5 CollectionScreen (route: /collection)
Layout:
┌──────────────────────────────────────┐
│  Моя коллекция          Фильтр ▼    │
│                                      │
│  [Все] [Аудио] [Текст] [Избранное]  │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 🐾  Маша и медвежонок       │   │
│  │ 🎧 3:12  •  вчера      ♡    │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 📖  Лесные приключения       │   │
│  │ текст  •  2 фев         ♡    │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ 🌲  Сказка о дубе-великане   │   │
│  │ 🎧 4:01  •  1 фев       ♥    │   │
│  └──────────────────────────────┘   │
│  ...                                │
│                                      │
│  [BottomNav]                         │
└──────────────────────────────────────┘

Компоненты и состояния:
FilterTabs — горизонтальные табы фильтрации.
Active tab: подчёркивание gradient primary-1 → primary-2, 2px, transition 200ms (sliding indicator)
HapticFeedback: selectionChanged() при переключении
TaleCard — карточка сказки в списке.
Элементы: аватар голоса (32x32), название (1 строка, ellipsis), мета (тип + дата), иконка избранного
Swipe left → кнопка «Удалить» (красная), 60px. WebApp.showConfirm() перед удалением
Тап → TalePlayerScreen
Long press (500ms) → HapticFeedback impactOccurred('medium') + контекстное меню через WebApp.showPopup()
EmptyState — когда коллекция пуста.
Иллюстрация: аватар Баюна (120x120) + текст «Здесь пока тихо… Создай первую сказку!»
CTA кнопка → CreateTaleScreen
Анимации:
Карточки: stagger fade-in, 50ms между карточками, translateY(12px) → translateY(0), 250ms
Удаление карточки: slide-out left 200ms + высота коллапс 200ms
FilterTabs indicator: sliding pill, width и position с transition 250ms ease
Telegram-нативные элементы:
BackButton: скрыт (это корневой таб)
MainButton: скрыт
3.6 ProfileScreen (route: /profile)
Layout:
┌──────────────────────────────────────┐
│  Профиль                             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [Аватар Telegram 56x56]      │  │
│  │  Имя пользователя             │  │
│  │  ⭐ Золотая подписка           │  │
│  │  🪙 12 монет                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  👶 Профиль ребёнка            │  │
│  │  Маша, 5 лет             →    │  │
│  ├────────────────────────────────┤  │
│  │  🔥 Серия: 7 дней подряд       │  │
│  │  ▓▓▓▓▓▓▓░░░  7/14 → +5🪙     │  │
│  ├────────────────────────────────┤  │
│  │  📊 Статистика                 │  │
│  │  Сказок создано: 23            │  │
│  │  Прослушано минут: 47          │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  💫 Подписка              →    │  │
│  ├────────────────────────────────┤  │
│  │  🪙 Купить монеты         →    │  │
│  ├────────────────────────────────┤  │
│  │  👥 Пригласить друга      →    │  │
│  ├────────────────────────────────┤  │
│  │  ⚙ Настройки              →    │  │
│  └────────────────────────────────┘  │
│                                      │
│  [BottomNav]                         │
└──────────────────────────────────────┘

Компоненты и состояния:
UserCard — информация о пользователе.
Loading: shimmer на аватаре (56x56 circle) + 2 строки текста
Filled: аватар из Telegram (через WebAppUser.photo_url), имя, бейдж подписки (pill с gradient), баланс монет
StreakProgress — визуализация streak.
Прогресс-бар: gradient fill, border-radius 8px, высота 8px
Анимация заполнения: width 0% → N% при монтировании, 600ms ease-out
MenuList — список пунктов навигации.
Каждый пункт: иконка + текст + chevron right
Тап → навигация на соответствующий экран
HapticFeedback: selectionChanged() при тапе
3.7 SubscriptionScreen (route: /subscription)
Layout:
┌──────────────────────────────────────┐
│ ← Назад            Подписки          │
│                                      │
│  «Выбери свой план волшебства»       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🥇 ЗОЛОТАЯ — 499₽/мес        │  │
│  │  30 аудиосказок • Голос Баюна  │  │
│  │  Безлимит текстовых            │  │
│  │  [Выбрать]                     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  ★ ПОПУЛЯРНЫЙ                  │  │
│  │  👨‍👩‍👧 СЕМЕЙНАЯ — 1199₽/мес      │  │
│  │  90 аудиосказок • 3 голоса     │  │
│  │  До 3 детей • Именные сказки   │  │
│  │  [Выбрать]                     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  💎 ПРЕМИУМ — 2990₽/мес       │  │
│  │  240 аудиосказок • ВСЕ голоса  │  │
│  │  До 5 детей • AI-иллюстрации  │  │
│  │  [Выбрать]                     │  │
│  └────────────────────────────────┘  │
│                                      │
│  💡 Есть годовые подписки           │
│     со скидкой 20%! →                │
│                                      │
└──────────────────────────────────────┘

Компоненты:
TariffCard — карточка тарифа.
Текущий тариф: рамка gradient + бейдж «Текущий»
Рекомендуемый (Семейная): выделена — увеличенный размер, бейдж «★ Популярный» сверху, border gradient glow
Каждая карточка: glassmorphism background, перечень ключевых фич (без bullet points — иконки + текст в строку)
CTA кнопка: gradient если это upgrade, outline если текущий/downgrade
Анимации:
Карточки: stagger scale(0.95) + opacity(0) → scale(1) + opacity(1), 300ms, delay 100ms между карточками
Рекомендуемая карточка: subtle float animation — translateY(0) → translateY(-4px) → translateY(0), 3s infinite ease-in-out
3.8 CoinsScreen (route: /coins)
Layout:
┌──────────────────────────────────────┐
│ ← Назад              Монеты         │
│                                      │
│  «Твой баланс: 🪙 12 монет»         │
│                                      │
│  ┌─────────┐ ┌─────────┐            │
│  │ 3 🪙    │ │ 10 🪙   │            │
│  │ 36₽     │ │ 99₽     │            │
│  │         │ │ -17%     │            │
│  └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐            │
│  │ 25 🪙   │ │ 50 🪙   │            │
│  │ 199₽    │ │ 349₽    │            │
│  │ -34%    │ │ -42%     │            │
│  └─────────┘ └─────────┘            │
│                                      │
│  «Бесплатные монеты»                │
│  ┌────────────────────────────────┐  │
│  │ 👥 Пригласи друга    +3🪙  →  │  │
│  │ 🔥 7 дней подряд     +2🪙  →  │  │
│  │ 📝 Напиши отзыв      +5🪙  →  │  │
│  │ 🎂 День рождения     +5🪙     │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

Компоненты:
CoinPackageGrid — 2x2 grid пакетов монет.
Каждый пакет: glassmorphism card, количество монет (крупный шрифт), цена, бейдж скидки (если есть)
Мега-пакет (50🪙) — показывается только при coins_spent >= 10 (запрашиваем у API)
Тап → WebApp.showPopup({ title: 'Купить 10 монет?', message: 'Стоимость: 99₽', buttons: [{type:'ok', text:'Купить'}, {type:'cancel'}] }) → при OK → оплата через ЮКассу
FreeCoinsSection — список способов бесплатного заработка.
Каждый пункт: иконка + описание + награда + chevron (если есть action)
Выполненные пункты: зачёркнутый текст + чекмарк
3.9 ReferralScreen (route: /referral)
Layout:
┌──────────────────────────────────────┐
│ ← Назад        Пригласи друзей       │
│                                      │
│  «Приглашено: 4 друга»              │
│  «Заработано: 🪙 12 монет»          │
│                                      │
│  🏆 Прогресс до награды:            │
│  ▓▓▓▓▓▓▓░░░  7/10 → +50🪙          │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  📤 Твоя ссылка:               │  │
│  │  t.me/FairyTalePortalBot?...   │  │
│  │  [Копировать] [Поделиться]     │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

Компоненты:
Кнопка «Поделиться» → WebApp.switchInlineQuery() или Telegram.WebApp.openTelegramLink('https://t.me/share/url?...')
Кнопка «Копировать» → navigator.clipboard.writeText() + HapticFeedback notificationOccurred('success') + toast «Ссылка скопирована»
3.10 ChildProfileScreen (route: /child-profile)
Layout:
┌──────────────────────────────────────┐
│ ← Назад        Профиль ребёнка       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Имя ребёнка                   │  │
│  │  [Маша________________]        │  │
│  └────────────────────────────────┘  │
│                                      │
│  «Сколько лет?»                      │
│  [3] [4] [5✓] [6] [7] [8] [9] [10]  │
│                                      │
│  «Дата рождения» (необязательно)    │
│  [__.__.____ ]                       │
│                                      │
│  «Любимые темы»                      │
│  [🐰Животные✓] [🏰Приключения]      │
│  [🤝Дружба✓] [✨Магия]               │
│  [🌳Природа] [😴Сон]                │
│                                      │
│  [====== MAINBUTTON: Сохранить ===]  │
└──────────────────────────────────────┘

Telegram-нативные элементы:
MainButton: «Сохранить профиль», disabled пока имя пустое
BackButton: видим, возврат на ProfileScreen
3.11 BottomNavigation (глобальный компонент)
Layout:
┌──────────────────────────────────────┐
│  ○        ○       ◉       ○       ○  │
│ Home    Архив   Создать  Коллекц  Проф│
│  🏠       📚      ✨       📖      👤  │
└──────────────────────────────────────┘

Компоненты:
5 табов: Home (/), Архив (/archive), Создать (/create — центральная, увеличенная), Коллекция (/collection), Профиль (/profile)
Центральная кнопка «Создать»: 64x64px, gradient background (primary-1 → primary-2), поднята на -16px над линией навбара, box-shadow glow
Active tab: иконка и текст меняют цвет на primary-2 (#c159ec), иконка scale(1.1)
Backdrop: glassmorphism (rgba(28, 27, 51, 0.85) + backdrop-filter: blur(20px)), border-top: 1px solid var(–stroke)
Safe area: padding-bottom учитывает env(safe-area-inset-bottom)
Анимации:
Переключение табов: иконка active — scale(1) → scale(1.1), 200ms spring
Ripple effect при тапе: radial gradient от точки касания, 300ms
HapticFeedback: selectionChanged() при каждом переключении таба
3.12 PaywallBottomSheet (глобальный оверлей)
Показывается при любом ограничении (лимит, заблокированный голос, премиум-фича).
Layout:
┌──────────────────────────────────────┐
│  ═══════ (drag handle) ═══════       │
│                                      │
│  😢 Лимит аудиосказок исчерпан       │
│     (30/30)                          │
│                                      │
│  Варианты:                           │
│  ┌────────────────────────────────┐  │
│  │  🪙 Купить за 3 монеты (36₽)  │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  ⭐ Оформить подписку          │  │
│  │     от 499₽/мес                │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  📖 Читать текстовые сказки    │  │
│  │     БЕЗЛИМИТНО!                │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

Анимации:
Появление: slide-up 300ms ease-out + overlay fade-in 200ms
Dismiss: drag-down gesture (если drag > 100px → dismiss), или тап на overlay
Кнопки: обычный active state scale(0.97), 100ms

4. ТЕХНИЧЕСКАЯ АРХИТЕКТУРА
Рекомендуемый стек
Фреймворк: React 18 + TypeScript (уже в проекте)
 Роутинг: react-router-dom 6 (уже в проекте)
 Серверное состояние: @tanstack/react-query 5 (уже в проекте)
 Клиентское состояние: Zustand 4 (лёгкий, 1.1KB gzip — для auth-токенов, UI-состояний плеера, текущей темы)
 Стили: CSS Modules + CSS Custom Properties (без дополнительных библиотек — экономим бандл)
 Telegram SDK: @twa-dev/sdk 7 (уже в проекте)
 Сборщик: Vite 5 (уже в проекте)
 Дополнительно: framer-motion НЕ ставим — все анимации на CSS transitions/keyframes (экономия ~30KB gzip)
Структура проекта
mini-app/
├── public/
│   └── assets/
│       ├── backgrounds/
│       │   ├── portal-main.webp       ← VT60eKzJ (обрезан до 480x800)
│       │   ├── forest-path.webp       ← XjOjnGhv
│       │   ├── portal-runes.webp      ← kc9KMXdc
│       │   ├── forest-mist.webp       ← XjqgQ2Gn
│       │   ├── fairy-magic.webp       ← WjQTnRyF
│       │   └── fairy-create.webp      ← ae49vBUP
│       └── characters/
│           ├── bayun.webp             ← WvEqqwRM
│           ├── leshiy.webp            ← REHYk7HC
│           ├── rusalka.webp           ← fVd6bJy8
│           └── dobrynya.webp          ← L2N7I2hu
├── src/
│   ├── app/
│   │   ├── router.tsx                 # Роуты приложения
│   │   ├── queryClient.ts            # React Query конфиг
│   │   └── providers.tsx              # Обёртка всех провайдеров
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx
│   │   │   ├── HomePage.module.css
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CharacterCarousel.tsx
│   │   │   └── RecommendationList.tsx
│   │   ├── CreateTalePage/
│   │   │   ├── CreateTalePage.tsx
│   │   │   ├── CreateTalePage.module.css
│   │   │   ├── ThemeInput.tsx
│   │   │   ├── QuickThemeChips.tsx
│   │   │   ├── VoiceSelector.tsx
│   │   │   └── AudioToggle.tsx
│   │   ├── TaleGenerationPage/
│   │   │   ├── TaleGenerationPage.tsx
│   │   │   └── PortalAnimation.module.css
│   │   ├── TalePlayerPage/
│   │   │   ├── TalePlayerPage.tsx
│   │   │   ├── TalePlayerPage.module.css
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── TaleText.tsx
│   │   ├── CollectionPage/
│   │   │   ├── CollectionPage.tsx
│   │   │   ├── CollectionPage.module.css
│   │   │   ├── FilterTabs.tsx
│   │   │   └── TaleCard.tsx
│   │   ├── ProfilePage/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── ProfilePage.module.css
│   │   ├── SubscriptionPage/
│   │   │   ├── SubscriptionPage.tsx
│   │   │   └── TariffCard.tsx
│   │   ├── CoinsPage/
│   │   │   ├── CoinsPage.tsx
│   │   │   └── CoinPackageGrid.tsx
│   │   ├── ReferralPage/
│   │   │   └── ReferralPage.tsx
│   │   └── ChildProfilePage/
│   │       └── ChildProfilePage.tsx
│   ├── shared/
│   │   ├── api/
│   │   │   ├── client.ts              # fetch-обёртка с auth-заголовками
│   │   │   ├── endpoints.ts           # Все эндпоинты как константы
│   │   │   └── types.ts              # TypeScript-типы ответов API
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx         # Context + Provider
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── useAuth.ts            # Hook для авторизации
│   │   ├── components/
│   │   │   ├── Layout.tsx             # Обёртка с BottomNav
│   │   │   ├── BottomNav/
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── BottomNav.module.css
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Shimmer.tsx            # Skeleton loader
│   │   │   ├── EmptyState.tsx
│   │   │   ├── PaywallSheet.tsx       # Bottom sheet paywall
│   │   │   ├── Toast.tsx              # Уведомления
│   │   │   └── BottomSheet.tsx        # Переиспользуемый bottom sheet
│   │   ├── hooks/
│   │   │   ├── useTelegram.ts         # Обёртка над @twa-dev/sdk
│   │   │   ├── useHaptic.ts          # HapticFeedback утилиты
│   │   │   ├── useAudioPlayer.ts     # Логика HTML5 аудиоплеера
│   │   │   └── usePaywall.ts         # Логика показа paywall
│   │   └── stores/
│   │       ├── authStore.ts           # Zustand: токены, user
│   │       ├── playerStore.ts         # Zustand: состояние плеера
│   │       └── uiStore.ts            # Zustand: paywall, toasts
│   ├── styles/
│   │   ├── variables.css              # CSS Custom Properties
│   │   ├── reset.css                  # Минимальный reset
│   │   ├── animations.css             # Глобальные keyframes
│   │   └── typography.css             # Типографика
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

Схема взаимодействия с бэкендом
Базовый URL: http://localhost:8000 (dev) / https://api.fairy-portal.ru (prod) — через env-переменную VITE_API_URL.
Готовые эндпоинты в API (по коду из репо):
POST /api/v1/auth/telegram — авторизация через initData. Request: { init_data: string }. Response: { tokens: { access_token, refresh_token, token_type }, user: UserRead }.
POST /api/v1/auth/refresh — обновление токенов. Request: { refresh_token: string }. Response: { access_token, refresh_token, token_type }.
GET /api/v1/users/me — данные текущего пользователя. Response: UserRead { user_id, subscription, subscription_end, coins, daily_limit, audio_limit }.
PATCH /api/v1/users/me — обновление профиля. Request: UserUpdate { subscription?, subscription_end?, coins?, daily_limit?, audio_limit? }.
GET /api/v1/users/me/stats — статистика. Response: { tts_minutes, tales_count }.
GET /api/v1/tales — список сказок пользователя. Response: TaleRead[].
GET /api/v1/tales/:id — одна сказка. Response: TaleRead { id, text, audio_path, type, date, is_favorite }.
POST /api/v1/tales/generate — генерация по теме. Request: { theme: string, with_audio: boolean }. Response: TaleRead.
POST /api/v1/tales/generate/named — именная сказка. Request: { name: string, with_audio: boolean }. Response: TaleRead.
POST /api/v1/tales/generate/night — сказка на ночь. Request: { with_audio: boolean }. Response: TaleRead.
GET /api/v1/collection — коллекция. Response: CollectionItemRead[].
DELETE /api/v1/collection/:id — удаление.
POST /api/v1/collection/:id/favorite — добавление в избранное. Response: CollectionItemRead.
Эндпоинты, которые нужно ПОПРОСИТЬ мужа добавить в API (бэкенд):
POST /api/v1/tales/generate — добавить поле voice_id в request ("baun" | "leshiy" | "rusalka" | "dobrynya"), чтобы фронт передавал выбранный голос. Текущая версия не принимает voice_id.
GET /api/v1/tales/archive — отдельный эндпоинт для архивных (кураторских) сказок, с фильтрацией по age_category и themes. Пагинация: ?page=1&limit=20&age=5-7&theme=animals.
POST /api/v1/child-profiles — создание профиля ребёнка. Request: { child_name: string, child_age: number, child_birthday?: string, preferred_themes?: string[] }.
GET /api/v1/child-profiles — список профилей детей текущего пользователя.
PATCH /api/v1/child-profiles/:id — обновление профиля ребёнка.
POST /api/v1/payments/create — создание платежа. Request: { type: "subscription" | "coins", tariff_id?: number, coins_package?: string }. Response: { payment_id, confirmation_url, status }.
GET /api/v1/users/me/referral — реферальная информация. Response: { referral_code, friends_invited, friends_activated, coins_earned, progress_to_next_reward }.
GET /api/v1/tales/recommendations — рекомендации. Query: ?limit=10. Response: TaleRead[] с учётом возраста и предпочтений.
Авторизация
Фронтенд при запуске извлекает window.Telegram.WebApp.initData (строка). Отправляет её на POST /api/v1/auth/telegram. Бэкенд валидирует HMAC-подпись с помощью BOT_TOKEN, извлекает user_id, создаёт (или находит) пользователя, возвращает JWT access_token (15 мин) + refresh_token (30 дней).
Access token хранится в Zustand store (in-memory, не localStorage — при закрытии Mini App теряется, при следующем открытии повторная авторизация через initData — это нормально и быстро). Все запросы к API идут с заголовком Authorization: Bearer {access_token}. При 401 → автоматический refresh → при повторном 401 → повторная авторизация через initData.
Стратегия кэширования
React Query настроен: staleTime: 5 * 60 * 1000 (5 минут), gcTime: 30 * 60 * 1000 (30 минут). Список сказок, профиль пользователя, коллекция — всё кэшируется. Мутации (generate, favorite, delete) инвалидируют соответствующие query keys.
Аудиофайлы: браузер кэширует MP3 сам (Cache-Control заголовок со стороны CDN). Фоновые изображения: preload через <link rel="preload"> в index.html для portal-main.webp и forest-mist.webp (два самых используемых фона).
Оффлайн-поведение
Полноценный офлайн не реализуем (генерация требует API). При потере сети: показываем toast «Нет подключения» + кнопка retry. Кэшированные данные из React Query продолжают отображаться. Аудиоплеер: если файл уже буферизирован — продолжает играть.

5. ДИЗАЙН-СИСТЕМА
Цветовая схема
Палитра извлечена из присланных ассетов (тёмная сказочная тема). Telegram themeParams используем как fallback, но основные цвета захардкожены — у нас авторский визуал, не generic Telegram UI.
:root {
  /* ——— Фоны ——— */
  --bg-primary:    #1c1b33;     /* Основной фон (самый тёмный) */
  --bg-secondary:  #2e335a;     /* Вторичный фон (карточки) */
  --bg-surface:    #1f1d47;     /* Поверхность элементов */

  /* ——— Glassmorphism ——— */
  --glass:         rgba(31, 29, 71, 0.65);
  --glass-border:  rgba(255, 255, 255, 0.12);
  --glass-blur:    12px;

  /* ——— Акценты ——— */
  --accent-purple:  #c159ec;    /* Основной акцент (CTA, active) */
  --accent-blue:    #3658b1;    /* Вторичный акцент */
  --accent-teal:    #48c9b0;    /* Успех, подтверждение */
  --accent-gold:    #f4d03f;    /* Монеты, premium */
  --accent-pink:    #f7cbfd;    /* Ошибки (мягкий, не агрессивный) */

  /* ——— Градиенты ——— */
  --gradient-primary:  linear-gradient(135deg, #3658b1 0%, #c159ec 100%);
  --gradient-gold:     linear-gradient(135deg, #f4d03f 0%, #f0932b 100%);
  --gradient-hero:     linear-gradient(165deg, rgba(46,51,90,0.9), rgba(28,27,51,0.9));

  /* ——— Текст ——— */
  --text-primary:   #e0d9ff;                     /* Основной текст */
  --text-secondary: rgba(224, 217, 255, 0.7);    /* Вторичный текст */
  --text-disabled:  rgba(224, 217, 255, 0.35);   /* Disabled */

  /* ——— Персонажи (glow-цвета для рамок) ——— */
  --char-bayun:    #a78bfa;   /* Лавандовый */
  --char-leshiy:   #34d399;   /* Зелёный */
  --char-rusalka:  #67e8f9;   /* Голубой */
  --char-dobrynya: #fbbf24;   /* Золотой */
}

Типографика
Шрифт: Inter (не Poppins, как в текущем CSS — Inter лучше читается на маленьких экранах, поддерживает кириллицу нативно, есть variable font).
/* Подключение: один variable font, ~95KB */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 300 700;
  font-display: swap;
}

/* ——— Уровни типографики ——— */
--font-family:    'Inter', -apple-system, system-ui, sans-serif;

--text-hero:      500 24px/1.2  var(--font-family);  /* Заголовок Hero */
--text-h1:        600 20px/1.3  var(--font-family);  /* Заголовки экранов */
--text-h2:        500 17px/1.35 var(--font-family);  /* Подзаголовки секций */
--text-body:      400 15px/1.5  var(--font-family);  /* Основной текст */
--text-body-sm:   400 13px/1.5  var(--font-family);  /* Вторичный текст */
--text-caption:   500 11px/1.4  var(--font-family);  /* Подписи, бейджи */
--text-tale:      400 16px/1.65 var(--font-family);  /* Текст сказки (увеличенный) */

Сетка и отступы
Базовый юнит: 4px. Все отступы кратны 4px.
--space-xs:   4px;    /* Минимальный зазор */
--space-sm:   8px;    /* Между иконкой и текстом */
--space-md:   12px;   /* Между элементами внутри карточки */
--space-lg:   16px;   /* Отступы карточки от краёв, между карточками */
--space-xl:   20px;   /* Отступы секций */
--space-2xl:  24px;   /* Большие секционные отступы */
--space-3xl:  32px;   /* Между крупными блоками */

--page-padding: 16px;  /* Боковые отступы контента от краёв экрана */
--content-max-width: 480px;

Радиусы, тени, границы
--radius-sm:   8px;   /* Чипсы, бейджи, мелкие элементы */
--radius-md:   14px;  /* Кнопки, инпуты */
--radius-lg:   20px;  /* Карточки */
--radius-xl:   24px;  /* Контейнеры, секции */
--radius-full: 9999px; /* Аватары, pills */

--shadow-sm:   0 4px 12px rgba(10, 12, 30, 0.2);
--shadow-md:   0 12px 24px rgba(10, 12, 30, 0.35);
--shadow-lg:   0 20px 40px rgba(10, 12, 30, 0.45);
--shadow-glow: 0 0 20px rgba(193, 89, 236, 0.3);   /* Акцентный glow */

--border-default: 1px solid var(--glass-border);

Haptic Feedback: маппинг событий
Тап на кнопку навигации        → selectionChanged()
Тап на play/pause              → impactOccurred('light')
Создание сказки (submit)       → impactOccurred('medium')
Сказка сгенерирована (success) → notificationOccurred('success')
Ошибка генерации               → notificationOccurred('error')
Добавить в избранное            → impactOccurred('light')
Удаление сказки                 → notificationOccurred('warning')
Покупка монет (confirm)         → impactOccurred('medium')
Paywall появился                → impactOccurred('rigid')
Копирование реферальной ссылки  → notificationOccurred('success')
Long press на карточку          → impactOccurred('medium')
Swipe delete                    → impactOccurred('light')


6. СОСТОЯНИЯ И EDGE CASES
Поведение при потере сети
При navigator.onLine === false или при fetch-ошибке типа TypeError (network): показываем глобальный toast сверху экрана — «Проверьте подключение к интернету». Toast не исчезает, пока сеть не восстановится. Кэшированные данные из React Query продолжают отображаться. Все кнопки, инициирующие запросы, получают состояние disabled. При восстановлении сети — автоматический queryClient.refetchQueries().
Поведение при медленной загрузке
Все списки (коллекция, рекомендации, архив) показывают Shimmer-скелетоны: прямоугольники с анимированным градиентом (фон: var(–bg-secondary), блик: rgba(255,255,255,0.05) → rgba(255,255,255,0.12) → rgba(255,255,255,0.05), animation: shimmer 1.5s infinite linear, background-size: 200% 100%).
Генерация сказки: отдельный полноэкранный Loading (TaleGenerationPage). Timeout: если ответ не пришёл за 45 секунд — показываем «Что-то пошло не так» + retry.
Загрузка аудио: seekbar показывает buffered range (серым), кнопка play disabled пока не загружено минимум 3 секунды буфера.
Поведение при невалидных данных с бэкенда
Если ответ API не проходит TypeScript-валидацию (отсутствуют обязательные поля) — логируем в console.error, показываем generic error state на соответствующем экране: «Произошла магическая ошибка» + кнопка retry. Никогда не крашим приложение — каждый компонент обёрнут в ErrorBoundary (один глобальный на уровне Layout).
Поведение при закрытии/сворачивании Mini App
При viewportChanged event с isStateStable: false (сворачивание): если аудиоплеер играет — продолжаем воспроизведение (HTML5 audio не останавливается при сворачивании WebView). При полном закрытии Mini App (WebApp.close()) — токены теряются (in-memory), при следующем открытии — мгновенная повторная авторизация через initData (< 500ms).
Deep linking и повторный вход
Bot отправляет кнопку WebApp с URL https://miniapp.fairy-portal.ru?startapp=tale_123. Mini App при старте проверяет WebApp.initDataUnsafe.start_param:
payment_success → показать toast «Оплата прошла!» + refetch user data
tale_XXX → навигация на /tale/XXX
create → навигация на /create
Без параметра → HomeScreen
Обработка viewport resize (клавиатура)
При фокусе на input-поле виртуальная клавиатура уменьшает viewport. Подписываемся на WebApp.onEvent('viewportChanged'). При уменьшении viewport: BottomNav скрываем (display: none), контент скроллируем так, чтобы input был видим. При восстановлении viewport: BottomNav возвращаем с fade-in 150ms.

7. ПРИЁМКА И КРИТЕРИИ ГОТОВНОСТИ
Чеклист Definition of Done — ФАЗА 1 (MVP, первая итерация)
HomeScreen:
[ ] Авторизация через initData отрабатывает без ошибок
[ ] Отображается имя пользователя, баланс монет, статус подписки
[ ] Карусель персонажей рендерится, locked/unlocked корректно по тарифу
[ ] Тап на unlocked персонажа → CreateTalePage с предвыбранным голосом
[ ] Тап на locked → PaywallSheet
[ ] Все shimmer-состояния отображаются при загрузке
CreateTalePage:
[ ] Ввод темы работает, максимум 200 символов
[ ] Чипсы заполняют поле темы
[ ] VoiceSelector выбирает голос (radio-поведение)
[ ] MainButton активируется при непустой теме
[ ] Запрос на генерацию уходит с корректными параметрами
[ ] Показывается TaleGenerationPage во время ожидания
TalePlayerPage:
[ ] Текст сказки отображается
[ ] Аудиоплеер: play, pause, seek, отображение времени
[ ] Кнопка избранного работает (POST /collection/:id/favorite)
[ ] BackButton возвращает на предыдущий экран
CollectionPage:
[ ] Список сказок загружается и отображается
[ ] Фильтрация по табам (все, аудио, текст, избранное) работает
[ ] Тап на карточку → TalePlayerPage
[ ] Удаление через swipe или контекстное меню
[ ] Empty state при пустой коллекции
ProfilePage:
[ ] Данные пользователя отображаются корректно
[ ] Навигация на SubscriptionPage, CoinsPage, ReferralPage, ChildProfilePage
[ ] Streak отображается
SubscriptionPage:
[ ] 3 тарифа отображаются с корректными ценами и описаниями
[ ] Тап «Выбрать» → открывает external link на ЮКассу
[ ] Текущий тариф отмечен
CoinsPage:
[ ] Пакеты отображаются
[ ] Баланс монет актуален
[ ] Тап на пакет → popup подтверждения → оплата
ChildProfilePage:
[ ] Создание профиля ребёнка (имя + возраст)
[ ] Сохранение отправляет данные на API
BottomNavigation:
[ ] 5 табов, центральная кнопка увеличена
[ ] Активный таб подсвечен
[ ] Скрывается при открытой клавиатуре
PaywallSheet:
[ ] Показывается при исчерпании лимита
[ ] Три варианта действия (монеты, подписка, текстовые сказки)
[ ] Dismiss по drag-down и тапу на overlay
Минимальные метрики перформанса
LCP (Largest Contentful Paint): < 1.5s на 4G
TTI (Time to Interactive): < 2s на 4G
Bundle size: < 150KB gzipped (без шрифта и изображений)
Шрифт Inter Variable: < 100KB (woff2)
Фоновые изображения: каждое < 80KB (webp, quality 75, resize до 480px width)
Аватары персонажей: каждый < 15KB (webp, 128x128px)
FPS при скролле: > 55fps
Устройства и версии для тестирования
iPhone SE (375px) — минимальная ширина
iPhone 14 (390px) — основной размер
iPhone 14 Pro Max (430px) — максимальная ширина
Samsung Galaxy A13 (360px, Android) — бюджетный Android
Telegram iOS (последняя версия)
Telegram Android (последняя версия)
Telegram Desktop (macOS/Windows) — проверить что не ломается, но не приоритет
Accessibility минимум
Все интерактивные элементы: minimum touch target 44x44px
Контраст текста: WCAG AA (4.5:1 для body text, 3:1 для large text). На тёмном фоне #1c1b33 текст #e0d9ff даёт контраст ~10:1 — отлично
Аудиоплеер: все кнопки с aria-label («Воспроизвести сказку», «Поставить на паузу», «Перемотать на 15 секунд вперёд»)
Изображения персонажей: alt="Кот Баюн", alt="Леший" и т.д.
Focus visible стили: outline 2px solid var(–accent-purple) для клавиатурной навигации (актуально в Desktop Telegram)

ПРИЛОЖЕНИЕ A: СПИСОК ЗАДАЧ ВНЕ CURSOR (для тебя)
Ассеты, которые нужно подготовить
1. Конвертировать все изображения в WebP:
Фоны: сжать до ширины 480px (для ретины — 960px), quality 75–80, сохранить как .webp
Аватары персонажей: обрезать до квадрата, resize до 128x128 (для ретины — 256x256), quality 85, сохранить как .webp
Инструмент: Squoosh.app (бесплатный, в браузере)
Таблица файлов:
Исходник
Целевой файл
Размер
Формат
VT60eKzJ (портал+Баюн)
portal-main.webp
480×800
webp q80
XjOjnGhv (тропинка в лесу)
forest-path.webp
480×800
webp q75
kc9KMXdc (портал с рунами)
portal-runes.webp
480×800
webp q75
XjqgQ2Gn (туманный лес)
forest-mist.webp
480×800
webp q75
WjQTnRyF (фея+магия)
fairy-magic.webp
480×800
webp q75
ae49vBUP (фея у портала)
fairy-create.webp
480×800
webp q75
WvEqqwRM (Кот Баюн)
bayun.webp
128×128
webp q85
REHYk7HC (Леший)
leshiy.webp
128×128
webp q85
fVd6bJy8 (Русалка)
rusalka.webp
128×128
webp q85
L2N7I2hu (Добрыня)
dobrynya.webp
128×128
webp q85

2. Скачать шрифт Inter Variable:
Скачать Inter-Variable.woff2 с rsms.me/inter (раздел «Download», файл Inter.var.woff2)
Положить в mini-app/public/fonts/Inter-Variable.woff2
3. Создать иконки для BottomNav (SVG):
Нужно 5 иконок: Home (домик), Archive/Книга, Создать (звезда/волшебная палочка), Коллекция (стопка книг), Профиль (человечек)
Стиль: outline stroke 1.5px, monoline, 24×24 viewBox
Можно взять из Lucide Icons (MIT лицензия): home, book-open, sparkles, library, user
Экспортировать как inline SVG (не файлы — вставить прямо в компоненты)
4. Попросить мужа добавить в API следующие эндпоинты (см. раздел 4):
POST /api/v1/tales/generate → добавить поле voice_id в request
GET /api/v1/tales/archive → архив кураторских сказок с пагинацией
CRUD /api/v1/child-profiles
POST /api/v1/payments/create
GET /api/v1/users/me/referral
GET /api/v1/tales/recommendations
5. Настроить CORS на бэкенде для домена mini-app (в settings.cors_origins_list добавить URL Mini App).
6. Зарегистрировать Mini App в BotFather:
Отправить /newapp в @BotFather
Указать URL Mini App (после деплоя)
Настроить menu button для бота → Web App
7. Favicon и Open Graph:
Подготовить favicon 192×192 (можно обрезать аватар Баюна)
OG-изображение 1200×630 (портал с Баюном + текст «Портал в Сказку»)

ПРИЛОЖЕНИЕ B: ИНСТРУКЦИЯ ДЛЯ CURSOR
Скопируй весь текст ниже и вставь как системный промпт или .cursorrules файл в корне mini-app/:
# Project: Портал в Сказку — Telegram Mini App

## Tech Stack
- React 18 + TypeScript (strict mode)
- Vite 5 (bundler)
- react-router-dom 6 (client-side routing)
- @tanstack/react-query 5 (server state)
- zustand 4 (client state — auth tokens, player state, UI)
- @twa-dev/sdk 7 (Telegram Mini App SDK)
- CSS Modules + CSS Custom Properties (no Tailwind, no styled-components)
- NO framer-motion — all animations via CSS transitions/keyframes

## Architecture Rules
1. Each page = folder in src/pages/ with PageName.tsx + PageName.module.css
2. Shared components in src/shared/components/
3. API layer in src/shared/api/ — typed fetch wrapper with auth
4. Hooks in src/shared/hooks/
5. Stores in src/shared/stores/ (zustand)
6. All colors, spacing, radii, shadows via CSS Custom Properties in src/styles/variables.css
7. Mobile-first: design for 360px min-width, max-width 480px
8. No hover effects as primary UX — only touch
9. All interactive elements: min touch target 44x44px

## API Base URL
VITE_API_URL env variable. Default: http://localhost:8000

## Auth Flow
1. On mount: get window.Telegram.WebApp.initData
2. POST /api/v1/auth/telegram { init_data }
3. Store access_token + refresh_token in zustand (in-memory, NOT localStorage)
4. All API calls: Authorization: Bearer {access_token}
5. On 401: try refresh via /api/v1/auth/refresh, if fails — re-auth via initData

## Telegram Mini App Integration
- On mount: WebApp.ready(), WebApp.expand()
- Set WebApp.setHeaderColor('#1c1b33')
- Set WebApp.setBackgroundColor('#1c1b33')
- BackButton: show on all pages except Home, handle with router.back()
- MainButton: use on CreateTalePage and ChildProfilePage
- HapticFeedback: see haptic mapping in brief
- showPopup/showConfirm for destructive actions
- openLink for external URLs (payment)

## Styling
- Dark theme only (no light theme support needed)
- Glassmorphism: backdrop-filter blur(12px), semi-transparent backgrounds
- Font: Inter Variable (loaded from /fonts/)
- All images: WebP format, in public/assets/
- Shimmer skeletons for all loading states
- Animations: CSS only, max 400ms, ease-out or cubic-bezier spring

## Performance Budget
- Bundle < 150KB gzipped
- LCP < 1.5s
- All images lazy-loaded except hero background
- Font: font-display: swap


Схема взаимодействия пользователя с приложением:
Пользователь
    │
    ├── Чат Telegram ──→ Бот (aiogram 3)
    │                        │
    │                        ├── Онбординг (сообщения от Баюна)
    │                        ├── Пуши / напоминания
    │                        └── Кнопка "Открыть Портал" 
    │                             (WebApp button с URL mini-app)
    │
    └── Mini App (TWA) ──→ API (FastAPI :8000)
         React + TS              │
         в WebView               ├── /auth/telegram
                                 ├── /tales/generate
                                 ├── /users/me
                                 ├── /collection
                                 └── /payments/create
                                      │
                                      └── PostgreSQL



Что делать с ассетами
Создай в проекте вот такую структуру папок и разложи файлы:
mini-app/
  public/
    fonts/
      Inter-Variable.woff2      ← из архива Inter-4.1.zip
    assets/
      backgrounds/
        portal-main.webp        ← 81 КБ
        forest-path.webp        ← 57 КБ
        portal-runes.webp       ← 61 КБ
        forest-mist.webp        ← 17 КБ
        fairy-magic.webp        ← 54 КБ
        fairy-create.webp       ← 38 КБ
      characters/
        bayun.webp              ← 18 КБ
        leshiy.webp             ← 19 КБ
        rusalka.webp            ← 17 КБ
        dobrynya.webp           ← 16 КБ




Экран
Фон
Почему
HomeScreen
portal-main.webp
Баюн у портала — главный вход
CreateTalePage
forest-path.webp
Тропинка — «выбери путь для сказки»
TaleGenerationPage
fairy-magic.webp
Фея колдует — магия плетётся
TalePlayerPage
forest-mist.webp
Спокойный туман — слушаешь сказку
SubscriptionPage
portal-runes.webp
Портал с рунами — «открой доступ к магии»
PaywallSheet / Лимит / Ошибка
fairy-create.webp
Фея расстроена — «магия закончилась»
CollectionPage
без фона


ProfilePage
без фона


CoinsPage
без фона

