# bot/router.py
from aiogram import Dispatcher, F
from bot.handlers import tale, named_tale, subscription, coins, collection, misc, night
from bot.states import DialogState
from bot.keyboards.main_menu import (
    BUTTON_TELL_TALE,
    BUTTON_CHOOSE_VOICE,
    BUTTON_RANDOM_TALE,
    BUTTON_NAMED_TALE,
    BUTTON_SUBSCRIPTION,
    BUTTON_COINS,
    BUTTON_NIGHT_TALE,
    BUTTON_COLLECTION,
    BUTTON_HELP,
    BUTTON_TALES_MENU,
    BUTTON_ACCOUNT_MENU,
    BUTTON_SETTINGS_MENU,
    BUTTON_BACK,
    BUTTON_MINI_APP,
)


def setup_routers(dp: Dispatcher):
    # Основные хендлеры
    dp.message.register(tale.start_command, F.text == "/start")
    dp.message.register(misc.open_mini_app, F.text == BUTTON_MINI_APP)
    
    # Меню и навигация
    dp.message.register(misc.show_tales_menu, F.text == BUTTON_TALES_MENU)
    dp.message.register(misc.show_account_menu, F.text == BUTTON_ACCOUNT_MENU)
    dp.message.register(misc.show_settings_menu, F.text == BUTTON_SETTINGS_MENU)
    dp.message.register(misc.back_to_main_menu, F.text == BUTTON_BACK)
    
    # Сказки
    dp.message.register(tale.tell_tale, F.text == BUTTON_TELL_TALE)
    dp.message.register(tale.process_theme, DialogState.awaiting_theme)
    dp.message.register(tale.tell_random_tale, F.text == BUTTON_RANDOM_TALE)
    dp.message.register(night.night_tale, F.text == BUTTON_NIGHT_TALE)
    
    # Именная сказка
    dp.message.register(named_tale.tell_named_tale, F.text == BUTTON_NAMED_TALE)
    dp.message.register(named_tale.process_named_tale, DialogState.awaiting_name)

    # Аккаунт
    dp.message.register(subscription.subscription_info, F.text == BUTTON_SUBSCRIPTION)
    dp.message.register(coins.show_coins, F.text == BUTTON_COINS)
    dp.message.register(collection.show_collection, F.text == BUTTON_COLLECTION)

    # Настройки
    dp.message.register(misc.choose_voice, F.text == BUTTON_CHOOSE_VOICE)
    dp.message.register(misc.show_help, F.text == BUTTON_HELP)

    # Fallback должен быть последним
    dp.message.register(misc.fallback_handler)
