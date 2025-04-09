import asyncio
import logging
import os
import requests
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import FSInputFile, ReplyKeyboardMarkup, KeyboardButton
from dotenv import load_dotenv
from pydub import AudioSegment
from openai import OpenAI
from datetime import datetime, timedelta
import db

# Load .env
load_dotenv()

# Logging
logging.basicConfig(level=logging.INFO)

# Tokens
TELEGRAM_TOKEN = os.getenv("BOT_TOKEN")
XAI_API_KEY = os.getenv("AI_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))
YANDEX_API_KEY = os.getenv("YANDEX_API_KEY")
YANDEX_FOLDER_ID = os.getenv("YANDEX_FOLDER_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Check
if not TELEGRAM_TOKEN or not XAI_API_KEY or not YANDEX_API_KEY or not YANDEX_FOLDER_ID or not OPENAI_API_KEY:
    raise ValueError("Missing .env tokens")

# Create directory for audio files
AUDIO_DIR = "../audio_files"
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

# Init
bot = Bot(token=TELEGRAM_TOKEN)
dp = Dispatcher()
client = OpenAI(api_key=OPENAI_API_KEY)


class DialogState(StatesGroup):
    message_count = State()
    awaiting_theme = State()
    awaiting_name = State()


# Main menu
main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="📖 Расскажи сказку"), KeyboardButton(text="🗣 Выбрать голос")],
        [KeyboardButton(text="📚 Расскажи рандомную сказку"), KeyboardButton(text="🧸 Расскажи именную сказку")],
        [KeyboardButton(text="💫 Подписка"), KeyboardButton(text="🪙 Монеты")],
        [KeyboardButton(text="🛌 Сказка на ночь"), KeyboardButton(text="🎁 Моя коллекция")],
        [KeyboardButton(text="ℹ Помощь")],
    ],
    resize_keyboard=True
)


# Fairytale logic
def get_grok_response(message, message_count, is_named=False):
    system_prompt = """
    Ты — хранитель русских народных традиций и мастер сказочного повествования. Твоя задача — создавать волшебные сказки в духе русского фольклора, наполненные чудесами, добрыми уроками и яркими образами. Используй архаичный, но понятный язык, добавляй элементы природы, магии и традиционных персонажей (например, Баба-Яга, Кощей, русалки, лешие). Сказка должна быть увлекательной, с моралью, и подходить для детей. Если пользователь задаёт тему, строго следуй ей, но добавляй сказочный колорит. Если темы нет, придумай свою, вдохновляясь русскими традициями.
    """
    if is_named:
        system_prompt += "\nСделай сказку именной — используй имя, которое предоставил пользователь, как главного героя."
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Сообщение номер {message_count}: {message}"}
            ],
            max_tokens=2000,
            temperature=0.85
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Ошибка AI: {e}")
        return "Что-то пошло не так при генерации сказки."


# TTS via Yandex Cloud
def synthesize_voice_with_yandex(text, voice="jane"):
    try:
        url = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize"
        headers = {"Authorization": f"Api-Key {YANDEX_API_KEY}"}
        data = {
            "text": text,
            "lang": "ru-RU",
            "voice": voice,
            "emotion": "good",
            "format": "mp3",
            "folderId": YANDEX_FOLDER_ID
        }
        response = requests.post(url, headers=headers, data=data)
        if response.status_code != 200:
            logging.error(f"Yandex TTS Error: {response.text}")
            return None
        # Сохраняем файл в постоянную директорию
        audio_path = os.path.join(AUDIO_DIR, f"audio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3")
        with open(audio_path, "wb") as f:
            f.write(response.content)
        return audio_path
    except Exception as e:
        logging.error(f"Yandex TTS Error: {e}")
        return None


# Start command
@dp.message(Command("start"))
async def start_command(message: types.Message, state: FSMContext):
    await db.add_user(message.from_user.id)
    await state.update_data(message_count=0)
    await message.answer(
        "✨ Добро пожаловать в “Портал в Сказку”!\n"
        "Я расскажу волшебные сказки голосами Кота Баюна и Русалки.\n"
        "Выбирайте — и откроем портал…",
        reply_markup=main_menu
    )


# Tell a tale (by theme)
@dp.message(Command("skazka"))
@dp.message(lambda message: message.text == "📖 Расскажи сказку")
async def tell_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    if not user:
        await db.add_user(message.from_user.id)
        user = await db.get_user(message.from_user.id)

    subscription = user[1]
    if subscription == "free":
        await message.answer("Эта функция доступна только для подписчиков. Оформите подписку — /subscribe")
    else:
        await message.answer("🎯 Задай тему для сказки:")
        await state.set_state(DialogState.awaiting_theme)


@dp.message(DialogState.awaiting_theme)
async def process_theme(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    subscription, coins = user[1], user[3]
    voice = "jane"  # Default

    data = await state.get_data()
    message_count = data.get("message_count", 0) + 1
    await state.update_data(message_count=message_count)

    fairytale = get_grok_response(message.text, message_count)
    await db.save_tale(message.from_user.id, fairytale, None, "text")
    await db.add_skazka(fairytale, None, "text")  # Сохраняем в таблицу skazki

    if subscription == "premium" or coins > 0:
        audio_path = synthesize_voice_with_yandex(fairytale, voice)
        if audio_path:
            await db.save_tale(message.from_user.id, fairytale, audio_path, "audio")
            await db.add_skazka(fairytale, audio_path, "audio")  # Сохраняем аудио в таблицу skazki
            await message.answer_voice(FSInputFile(audio_path), caption="Вот твоя сказка 🎙")
            await db.update_user(message.from_user.id, coins=coins - 1 if subscription != "premium" else coins)
        else:
            await message.answer(fairytale + "\n\nОшибка озвучки 😢")
    else:
        await message.answer(fairytale + "\n\n🪙 У вас не хватает монет для аудио. Купите — /coins")
    await state.clear()


# Tell a random tale
@dp.message(lambda message: message.text == "📚 Расскажи рандомную сказку")
async def tell_random_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    if not user:
        await db.add_user(message.from_user.id)
        user = await db.get_user(message.from_user.id)

    subscription, coins, daily_limit, audio_limit = user[1], user[3], user[4], user[5]
    today = datetime.now().date()
    sub_start = datetime.fromisoformat(user[2]).date()

    if subscription == "free":
        if (today - sub_start).days < 3 and audio_limit > 0:
            skazka = await db.get_random_skazka("audio")
            if skazka and skazka[1] and os.path.exists(skazka[1]):  # Проверяем, существует ли файл
                await db.update_user(message.from_user.id, audio_limit=audio_limit - 1)
                await db.save_tale(message.from_user.id, skazka[0], skazka[1], "audio")
                await message.answer_voice(FSInputFile(skazka[1]), caption="Вот твоя случайная сказка 🎙")
            else:
                await message.answer("Ошибка: нет доступных аудиосказок в базе или файл отсутствует!")
        else:
            skazka = await db.get_random_skazka("text")
            if skazka:
                await db.save_tale(message.from_user.id, skazka[0], None, "text")
                await message.answer(skazka[0] + "\n\n🧙 Голос Баюна уснул…\n"
                                                 "Но вы можете снова услышать его, оформив Золотую подписку — /subscribe")
            else:
                await message.answer("Ошибка: нет доступных текстовых сказок в базе!")
    else:
        skazka = await db.get_random_skazka(
            "audio") if coins > 0 or subscription == "premium" else await db.get_random_skazka("text")
        if skazka:
            if skazka[1] and os.path.exists(skazka[1]):  # Проверяем, существует ли файл
                await db.save_tale(message.from_user.id, skazka[0], skazka[1], "audio")
                await message.answer_voice(FSInputFile(skazka[1]), caption="Вот твоя случайная сказка 🎙")
                await db.update_user(message.from_user.id, coins=coins - 1 if subscription != "premium" else coins)
            else:
                await db.save_tale(message.from_user.id, skazka[0], None, "text")
                await message.answer(skazka[0])
        else:
            await message.answer("Ошибка: нет доступных сказок в базе!")


# Tell a named tale
@dp.message(lambda message: message.text == "🧸 Расскажи именную сказку")
async def tell_named_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    if not user:
        await db.add_user(message.from_user.id)

    subscription, coins = user[1], user[3]
    if subscription == "free" or (subscription != "premium" and coins < 2):
        await message.answer(
            "Для именной сказки нужно 2 монеты или Премиум-подписка. Проверьте — /coins или /subscribe")
    else:
        await message.answer("🧸 Как зовут главного героя сказки?")
        await state.set_state(DialogState.awaiting_name)


@dp.message(DialogState.awaiting_name)
async def process_named_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    subscription, coins = user[1], user[3]
    voice = "jane"  # Default

    data = await state.get_data()
    message_count = data.get("message_count", 0) + 1
    await state.update_data(message_count=message_count)

    fairytale = get_grok_response(message.text, message_count, is_named=True)
    await db.save_tale(message.from_user.id, fairytale, None, "named")
    await db.add_skazka(fairytale, None, "named")  # Сохраняем в таблицу skazki

    if subscription == "premium" or coins >= 2:
        audio_path = synthesize_voice_with_yandex(fairytale, voice)
        if audio_path:
            await db.save_tale(message.from_user.id, fairytale, audio_path, "named_audio")
            await db.add_skazka(fairytale, audio_path, "named_audio")  # Сохраняем аудио в таблицу skazki
            await message.answer_voice(FSInputFile(audio_path), caption="Вот твоя именная сказка 🎙")
            await db.update_user(message.from_user.id, coins=coins - 2 if subscription != "premium" else coins)
        else:
            await message.answer(fairytale + "\n\nОшибка озвучки 😢")
    else:
        await message.answer(fairytale)
    await state.clear()


# Voice selection
@dp.message(Command("voice"))
@dp.message(lambda message: message.text == "🗣 Выбрать голос")
async def choose_voice(message: types.Message):
    await message.answer("Доступные голоса:\n🐾 Кот Баюна (ermil)\n🧜‍♀️ Русалка (jane)\n"
                         "Выбор голоса пока в разработке!")


# Subscription
@dp.message(Command("subscribe"))
@dp.message(lambda message: message.text == "💫 Подписка")
async def subscription(message: types.Message):
    await message.answer(
        "🔓 Откройте доступ к магии сказок\n\n"
        "🧹 Бесплатно: 1 текст/день, 3 дня аудио\n"
        "🟡 Золотой (499 ₽): 1 аудио/день + текст\n"
        "🔵 Расширенный (999 ₽): 2 аудио/день, архив\n"
        "👑 Премиум (2990 ₽): безлимит, именные\n\n"
        "Платежи скоро будут доступны!"
    )


# Coins
@dp.message(Command("coins"))
@dp.message(lambda message: message.text == "🪙 Монеты")
async def coins(message: types.Message):
    user = await db.get_user(message.from_user.id)
    coins = user[3]
    await message.answer(
        f"🪙 Ваш баланс: {coins} монет\n\n"
        "📖 Сказка по теме — 1 монета\n"
        "🎧 Аудиосказка — 1 монета\n"
        "🧸 Именная сказка — 2 монеты\n"
        "🌙 Сказка с колыбельной — 2 монеты\n\n"
        "Пакеты:\n5 монет — 149 ₽\n15 монет — 399 ₽\n50 монет — 999 ₽\n"
        "Покупка скоро будет доступна!"
    )


# Night mode
@dp.message(Command("night"))
@dp.message(lambda message: message.text == "🛌 Сказка на ночь")
async def night_tale(message: types.Message):
    user = await db.get_user(message.from_user.id)
    if user[1] in ["extended", "premium"]:
        await message.answer("🛏 Режим “На ночь” активирован\n"
                             "Скоро расскажу успокаивающую сказку…")
    else:
        await message.answer("🛌 Сказка на ночь доступна только для Расширенного и Премиум тарифов!")


# Collection
@dp.message(Command("collection"))
@dp.message(lambda message: message.text == "🎁 Моя коллекция")
async def collection(message: types.Message):
    user = await db.get_user(message.from_user.id)
    if user[1] in ["extended", "premium"]:
        tales = await db.get_user_tales(message.from_user.id)
        if tales:
            response = "🎁 Ваши последние сказки:\n"
            for tale in tales:
                response += f"{tale[3]} - {tale[2]}\n"
            await message.answer(response)
        else:
            await message.answer("🎁 Пока здесь пусто!")
    else:
        await message.answer("🎁 Коллекция доступна только для Расширенного и Премиум тарифов!")


# Help
@dp.message(Command("help"))
@dp.message(lambda message: message.text == "ℹ Помощь")
async def help_command(message: types.Message):
    await message.answer("ℹ Я помогу вам погрузиться в мир сказок!\n"
                         "Используйте кнопки меню или команды:\n"
                         "/skazka — получить сказку\n"
                         "/subscribe — узнать о подписке\n"
                         "/coins — проверить монеты")


# Admin stats
@dp.message(Command("admin_stats"))
async def admin_stats(message: types.Message):
    if message.from_user.id == ADMIN_ID:
        stats = await db.get_stats(message.from_user.id)
        await message.answer(f"Статистика:\nTTS минут: {stats[0]}\nСказок сгенерировано: {stats[1]}")
    else:
        await message.answer("Нет доступа.")


# Fallback for unrecognized messages
@dp.message()
async def handle_unknown(message: types.Message):
    await message.answer("Я понимаю только команды и кнопки из меню. Попробуйте /start или выберите действие!")


# Run
async def main():
    await db.init_db()
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())