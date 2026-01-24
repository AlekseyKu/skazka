from __future__ import annotations

import logging
import os
from datetime import datetime

import requests
from openai import OpenAI

from app.core.config import settings


def generate_fairytale(theme: str, message_count: int, is_named: bool = False) -> str:
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is not configured")

    system_prompt = (
        "Ты — хранитель русских народных традиций и мастер сказочного повествования. "
        "Твоя задача — создавать волшебные сказки в духе русского фольклора, "
        "наполненные чудесами, добрыми уроками и яркими образами. Используй архаичный, "
        "но понятный язык, добавляй элементы природы, магии и традиционных персонажей."
    )
    if is_named:
        system_prompt += "\nСделай сказку именной — используй имя, которое предоставил пользователь, как главного героя."

    client = OpenAI(api_key=settings.openai_api_key)
    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Сообщение номер {message_count}: {theme}"},
            ],
            max_tokens=2000,
            temperature=0.85,
        )
        return completion.choices[0].message.content.strip()
    except Exception as exc:
        logging.error("OpenAI error: %s", exc)
        raise ValueError("Failed to generate tale") from exc


def synthesize_voice(text: str, voice: str = "jane") -> str | None:
    if not settings.yandex_api_key or not settings.yandex_folder_id:
        raise ValueError("YANDEX_API_KEY or YANDEX_FOLDER_ID is not configured")

    url = "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize"
    headers = {"Authorization": f"Api-Key {settings.yandex_api_key}"}
    data = {
        "text": text,
        "lang": "ru-RU",
        "voice": voice,
        "emotion": "good",
        "format": "mp3",
        "folderId": settings.yandex_folder_id,
    }
    response = requests.post(url, headers=headers, data=data, timeout=30)
    if response.status_code != 200:
        logging.error("Yandex TTS error: %s", response.text)
        return None

    os.makedirs(settings.audio_files_dir, exist_ok=True)
    filename = f"audio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
    audio_path = os.path.join(settings.audio_files_dir, filename)
    with open(audio_path, "wb") as file_handle:
        file_handle.write(response.content)

    return audio_path
