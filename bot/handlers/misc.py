from aiogram import types
from bot.keyboards.main_menu import (
    main_menu,
    tales_menu,
    account_menu,
    settings_menu,
    BUTTON_TALES_MENU,
    BUTTON_ACCOUNT_MENU,
    BUTTON_SETTINGS_MENU,
    BUTTON_BACK,
    BUTTON_MINI_APP,
)
from config import WEBAPP_URL


async def show_tales_menu(message: types.Message):
    await message.answer("📖 Выберите тип сказки:", reply_markup=tales_menu)


async def show_account_menu(message: types.Message):
    await message.answer("👤 Управление аккаунтом:", reply_markup=account_menu)


async def show_settings_menu(message: types.Message):
    await message.answer("⚙️ Настройки:", reply_markup=settings_menu)


async def back_to_main_menu(message: types.Message):
    await message.answer("🔙 Возврат в главное меню", reply_markup=main_menu if main_menu else None)


async def choose_voice(message: types.Message):
    await message.answer("Доступные голоса:\n🐾 Кот Баюна (ermil)\n🧜‍♀️ Русалка (jane)\n\nВыбор голоса пока в разработке!")


async def show_help(message: types.Message):
    await message.answer(
        "ℹ Я помогу вам погрузиться в мир сказок!\n"
        "Используйте кнопки меню или команды:\n"
        "/skazka — получить сказку\n"
        "/subscribe — узнать о подписке\n"
        "/coins — проверить монеты"
    )


async def fallback_handler(message: types.Message):
    await message.answer("Я понимаю только команды и кнопки из меню. Попробуйте /start или выберите действие!")


async def open_mini_app(message: types.Message):
    if WEBAPP_URL:
        await message.answer(f"Открыть Mini App: {WEBAPP_URL}")
    else:
        await message.answer("WEBAPP_URL не настроен. Укажите его в .env")
