from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo

from config import WEBAPP_URL

# Константы текстов кнопок главного меню
BUTTON_TALES_MENU = "📖 Сказки"
BUTTON_ACCOUNT_MENU = "👤 Аккаунт"
BUTTON_SETTINGS_MENU = "⚙️ Настройки"
BUTTON_MINI_APP = "🚀 Mini App"

# Константы текстов кнопок подменю "Сказки"
BUTTON_TELL_TALE = "📖 Расскажи сказку"
BUTTON_NAMED_TALE = "🧸 Расскажи именную сказку"
BUTTON_RANDOM_TALE = "📚 Текстовая сказка"
BUTTON_NIGHT_TALE = "🛌 Сказка на ночь"

# Константы текстов кнопок подменю "Аккаунт"
BUTTON_SUBSCRIPTION = "💫 Подписка"
BUTTON_COINS = "🪙 Монеты"
BUTTON_COLLECTION = "🎁 Моя коллекция"

# Константы текстов кнопок подменю "Настройки"
BUTTON_CHOOSE_VOICE = "🗣 Выбрать голос"
BUTTON_HELP = "ℹ Помощь"

# Константа для возврата
BUTTON_BACK = "🔙 Главное меню"

# Главное меню
mini_app_button = KeyboardButton(text=BUTTON_MINI_APP, web_app=WebAppInfo(url=WEBAPP_URL)) if WEBAPP_URL else None

main_menu = (
    ReplyKeyboardMarkup(
        keyboard=[
            [mini_app_button],
        ],
        resize_keyboard=True,
    )
    if mini_app_button
    else None
)

mini_app_inline = (
    InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text=BUTTON_MINI_APP, web_app=WebAppInfo(url=WEBAPP_URL))],
        ]
    )
    if WEBAPP_URL
    else None
)

# Подменю "Сказки"
tales_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text=BUTTON_TELL_TALE)],
        [KeyboardButton(text=BUTTON_NAMED_TALE)],
        [KeyboardButton(text=BUTTON_RANDOM_TALE)],
        [KeyboardButton(text=BUTTON_NIGHT_TALE)],
        [KeyboardButton(text=BUTTON_BACK)],
    ],
    resize_keyboard=True
)

# Подменю "Аккаунт"
account_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text=BUTTON_SUBSCRIPTION)],
        [KeyboardButton(text=BUTTON_COINS)],
        [KeyboardButton(text=BUTTON_COLLECTION)],
        [KeyboardButton(text=BUTTON_BACK)],
    ],
    resize_keyboard=True
)

# Подменю "Настройки"
settings_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text=BUTTON_CHOOSE_VOICE)],
        [KeyboardButton(text=BUTTON_HELP)],
        [KeyboardButton(text=BUTTON_BACK)],
    ],
    resize_keyboard=True
)
