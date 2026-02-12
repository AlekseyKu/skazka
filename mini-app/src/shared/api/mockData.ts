export const MOCK_USER = {
  user_id: 123456789,
  username: "Анастасия",
  subscription: "free" as const,
  subscription_end: null as string | null,
  coins: 12,
  daily_limit: 3,
  audio_limit: 1,
};

export const MOCK_CHILD_PROFILE = {
  id: 1,
  child_name: "Маша",
  child_age: 5,
  child_birthday: "2021-03-15",
  preferred_themes: ["animals", "magic", "friendship"],
};

export const MOCK_STATS = {
  tts_minutes: 47,
  tales_count: 23,
  streak_days: 7,
  streak_next_reward: 14,
  streak_reward_coins: 5,
};

export const MOCK_TALES = [
  {
    id: 1,
    text: "Жил-был на свете маленький котёнок по имени Мурзик. Каждый вечер он забирался на крышу и смотрел на звёзды. Однажды одна звезда мигнула ему три раза подряд, и котёнок понял — это приглашение в путешествие...",
    audio_path: null as string | null,
    type: "text" as const,
    date: "2026-02-12T10:30:00",
    is_favorite: true,
    voice: "bayun",
    title: "Котёнок и звёздное путешествие",
  },
  {
    id: 2,
    text: "В глубине дремучего леса стоял дуб-великан. Его ветви доставали до облаков, а корни уходили в самое сердце земли. Каждый вечер к дубу приходил маленький ёжик...",
    audio_path: "/audio/tale_2.mp3",
    type: "audio" as const,
    date: "2026-02-11T20:15:00",
    is_favorite: false,
    voice: "bayun",
    title: "Ёжик и дуб-великан",
  },
  {
    id: 3,
    text: "Русалка Маришка жила в тихом лесном озере. Она умела петь так красиво, что рыбки замирали, а кувшинки раскрывались даже ночью...",
    audio_path: "/audio/tale_3.mp3",
    type: "audio" as const,
    date: "2026-02-10T19:00:00",
    is_favorite: true,
    voice: "rusalka",
    title: "Песня Русалки Маришки",
  },
  {
    id: 4,
    text: "Добрыня Никитич ехал по широкой дороге. Впереди показалась развилка: налево пойдёшь — коня потеряешь, направо пойдёшь — друга найдёшь...",
    audio_path: null as string | null,
    type: "text" as const,
    date: "2026-02-09T15:00:00",
    is_favorite: false,
    voice: "dobrynya",
    title: "Добрыня на развилке",
  },
  {
    id: 5,
    text: "Леший сидел на пеньке и считал грибы. Один, два, три... Вдруг из-за ёлки выглянула маленькая девочка с корзинкой...",
    audio_path: "/audio/tale_5.mp3",
    type: "audio" as const,
    date: "2026-02-08T18:00:00",
    is_favorite: false,
    voice: "leshiy",
    title: "Леший и грибная полянка",
  },
];

export const MOCK_REFERRAL = {
  referral_code: "SKAZKA-ANA123",
  referral_link: "https://t.me/FairyTalePortalBot?start=ref_ANA123",
  friends_invited: 4,
  friends_activated: 2,
  coins_earned: 12,
  next_milestone: 5,
  next_milestone_reward: 10,
};

export const MOCK_RECOMMENDATIONS = [
  {
    id: 101,
    title: "Маша и медвежонок",
    type: "audio" as const,
    duration: "3:12",
    rating: 4.8,
    voice: "bayun",
  },
  {
    id: 102,
    title: "Лесные приключения",
    type: "audio" as const,
    duration: "4:01",
    rating: 4.6,
    voice: "leshiy",
  },
  {
    id: 103,
    title: "Звёздная колыбельная",
    type: "audio" as const,
    duration: "5:30",
    rating: 4.9,
    voice: "rusalka",
  },
];

export const CHARACTERS = [
  {
    id: "bayun",
    name: "Кот Баюн",
    description: "Мягкий, убаюкивающий голос. Рассказывает сказки у камина.",
    avatar: "/assets/characters/bayun.webp",
    glowColor: "#a78bfa",
    availableFrom: "free",
    unlockCost: 0,
  },
  {
    id: "leshiy",
    name: "Леший",
    description: "Загадочный шёпот леса. Знает все тайны дремучей чащи.",
    avatar: "/assets/characters/leshiy.webp",
    glowColor: "#34d399",
    availableFrom: "gold",
    unlockCost: 2,
  },
  {
    id: "rusalka",
    name: "Русалка",
    description: "Нежный, завораживающий голос воды и лунного света.",
    avatar: "/assets/characters/rusalka.webp",
    glowColor: "#67e8f9",
    availableFrom: "family",
    unlockCost: 2,
  },
  {
    id: "dobrynya",
    name: "Добрыня",
    description: "Богатырский голос! Для историй о храбрости и подвигах.",
    avatar: "/assets/characters/dobrynya.webp",
    glowColor: "#fbbf24",
    availableFrom: "premium",
    unlockCost: 3,
  },
];

/** Уровень подписки для сравнения доступа к голосам: free < gold < family < premium */
const SUBSCRIPTION_LEVEL: Record<string, number> = {
  free: 0,
  gold: 1,
  family: 2,
  premium: 3,
};

export function canUseCharacter(
  subscription: string,
  availableFrom: string,
): boolean {
  return (
    (SUBSCRIPTION_LEVEL[subscription] ?? 0) >=
    (SUBSCRIPTION_LEVEL[availableFrom] ?? 0)
  );
}

/** Короткое название тарифа для подсказки на заблокированном голосе */
export const AVAILABLE_FROM_LABEL: Record<string, string> = {
  gold: "Золотая",
  family: "Семейная",
  premium: "Премиум",
};

export const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Бесплатная",
    emoji: "🧹",
    monthly_price: 0,
    yearly_price: 0,
    yearly_monthly: 0,
    yearly_savings: 0,
    features: [
      "1 сказка из архива в день",
      "Безлимит текстовых сказок",
      "Голос Кота Баюна",
    ],
    limitations: [
      "Дополнительные голоса (Леший, Русалка, Добрыня)",
      "Именные сказки",
      "Сказки и колыбельная в разделе «На ночь»",
    ],
    highlighted: false,
    badge: null as string | null,
  },
  {
    id: "gold",
    name: "Золотая",
    emoji: "⭐",
    monthly_price: 499,
    yearly_price: 4790,
    yearly_monthly: 399,
    yearly_savings: 1198,
    features: [
      "30 аудиосказок в месяц",
      "Именные сказки с именем ребёнка",
      "2 голоса: Кот Баюн и Леший",
      "Безлимит текстовых сказок",
      "1 профиль ребёнка",
    ],
    limitations: [
      "Дополнительные голоса (Русалка, Добрыня)",
      "Колыбельная в разделе «На ночь»",
    ],
    highlighted: false,
    badge: null as string | null,
  },
  {
    id: "family",
    name: "Семейная",
    emoji: "👨‍👩‍👧",
    monthly_price: 1199,
    yearly_price: 11510,
    yearly_monthly: 959,
    yearly_savings: 2878,
    features: [
      "90 аудиосказок в месяц",
      "3 голоса: Баюн, Леший, Русалка",
      "До 3 профилей детей",
      "Именные сказки с именем ребёнка",
      "Сказки на ночь",
      "Колыбельная на ночь (1 в день, можно отложить)",
      "Архив сказок 30 дней",
    ],
    limitations: [] as string[],
    highlighted: true,
    badge: "⭐ Популярное",
  },
  {
    id: "premium",
    name: "Премиум",
    emoji: "👑",
    monthly_price: 2990,
    yearly_price: 28704,
    yearly_monthly: 2392,
    yearly_savings: 7176,
    features: [
      "240 аудиосказок в месяц",
      "ВСЕ 4 голоса включая Добрыню",
      "До 5 профилей детей",
      "Именные сказки и поздравления",
      "Безлимит сказок на ночь",
      "Колыбельная на ночь (1 в день, можно отложить)",
      "Архив сказок 30 дней",
      "Приоритетная генерация",
    ],
    limitations: [] as string[],
    highlighted: false,
    badge: null as string | null,
  },
];

export const COIN_PACKAGES = [
  { id: "mini", coins: 3, price: 36, discount: null as number | null },
  { id: "standard", coins: 10, price: 99, discount: 17 },
  { id: "big", coins: 25, price: 199, discount: 34 },
  { id: "mega", coins: 50, price: 349, discount: 42 },
];

export const FREE_COINS_OPTIONS = [
  {
    id: "referral",
    icon: "👥",
    text: "Пригласи друга",
    reward: 3,
    action: "/referral",
    done: false,
  },
  {
    id: "streak7",
    icon: "🔥",
    text: "7 дней подряд",
    reward: 2,
    action: null,
    done: true,
  },
  {
    id: "review",
    icon: "📝",
    text: "Напиши отзыв",
    reward: 5,
    action: "/review",
    done: false,
  },
  {
    id: "birthday",
    icon: "🎂",
    text: "День рождения ребёнка",
    reward: 5,
    action: null,
    done: false,
  },
];

export const MOCK_LIBRARY_TALES = [
  { id: 201, title: "Как медвежонок звёзды считал", voice: "bayun", duration: "4:12", theme: "animals" },
  { id: 202, title: "Русалочка и серебряная рыбка", voice: "rusalka", duration: "3:45", theme: "magic" },
  { id: 203, title: "Леший и заблудившийся зайчик", voice: "leshiy", duration: "5:01", theme: "friendship" },
  { id: 204, title: "Котёнок, который нашёл радугу", voice: "bayun", duration: "3:30", theme: "adventure" },
  { id: 205, title: "Добрыня и огненный дракон", voice: "dobrynya", duration: "6:15", theme: "courage" },
  { id: 206, title: "Колыбельная лунного света", voice: "rusalka", duration: "4:00", theme: "sleep" },
  { id: 207, title: "Три медведя и волшебный мёд", voice: "bayun", duration: "3:55", theme: "animals" },
  { id: 208, title: "Лесная фея и дождевая капля", voice: "leshiy", duration: "4:30", theme: "nature" },
  { id: 209, title: "Храбрый ёжик в тумане", voice: "bayun", duration: "3:20", theme: "courage" },
  { id: 210, title: "Сказка о доброй ведьме", voice: "rusalka", duration: "5:10", theme: "magic" },
];

export const MOCK_TALE_OF_THE_DAY = {
  id: 301,
  title: "Как ёжик нашёл звезду",
  voice: "bayun",
  duration: "3:45",
  description:
    "Сказка о маленьком ёжике, который однажды вечером увидел упавшую звезду и отправился в путешествие, чтобы вернуть её на небо.",
};

/** Архив колыбельных для раздела «На ночь». Одна в день выдаётся по подписке. taleId — id сказки для воспроизведения в плеере. */
export const MOCK_LULLABIES = [
  { id: "lullaby-1", title: "Колыбельная лунного света", voice: "rusalka", duration: "4:00", taleId: 206 },
  { id: "lullaby-2", title: "Звёздная колыбельная", voice: "bayun", duration: "3:30", taleId: 201 },
  { id: "lullaby-3", title: "Тихий лес", voice: "leshiy", duration: "4:15", taleId: 208 },
  { id: "lullaby-4", title: "Сон-трава", voice: "rusalka", duration: "3:45", taleId: 202 },
  { id: "lullaby-5", title: "Под крылом луны", voice: "bayun", duration: "4:20", taleId: 207 },
];

/** Колыбельная на сегодня: одна в день, детерминированно по дате (для мока). */
export function getLullabyOfTheDay(): (typeof MOCK_LULLABIES)[number] {
  const dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const index = Math.abs(hashString(dateKey)) % MOCK_LULLABIES.length;
  return MOCK_LULLABIES[index];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

