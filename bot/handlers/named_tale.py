from aiogram import types
from aiogram.fsm.context import FSMContext
from bot.states import DialogState
from core.ai import get_fairytale
from core.tts import synthesize_voice_with_yandex
from db import queries as db
from aiogram.types import FSInputFile


async def tell_named_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    subscription, coins = user[1], user[3]

    if subscription == "free" and coins < 2:
        await message.answer("Для именной сказки нужно 2 монеты или Премиум-подписка. Проверьте — /coins или /subscribe")
    else:
        await message.answer("🧸 Как зовут главного героя сказки?")
        await state.set_state(DialogState.awaiting_name)


async def process_named_tale(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    subscription, coins = user[1], user[3]
    voice = "jane"

    data = await state.get_data()
    message_count = data.get("message_count", 0) + 1
    await state.update_data(message_count=message_count)

    fairytale = get_fairytale(message.text, message_count, is_named=True)
    await db.save_tale(message.from_user.id, fairytale, None, "named")
    await db.add_skazka(fairytale, None, "named")

    if subscription == "premium" or coins >= 2:
        audio_path = synthesize_voice_with_yandex(fairytale, voice)
        if audio_path:
            await db.save_tale(message.from_user.id, fairytale, audio_path, "named_audio")
            await db.add_skazka(fairytale, audio_path, "named_audio")
            await message.answer_voice(FSInputFile(audio_path), caption="Вот твоя именная сказка 🎙")
            if subscription != "premium":
                await db.update_user(message.from_user.id, coins=coins - 2)
        else:
            await message.answer(fairytale + "\n\nОшибка озвучки 😢")
    else:
        await message.answer(fairytale)
    await state.clear()
