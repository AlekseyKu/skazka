import logging
from openai import OpenAI
from config import (
    ALICEAI_API_KEY,
    ALICEAI_BASE_URL,
    ALICEAI_MODEL_URI,
    OPENAI_API_KEY,
)


def _build_ai_client() -> tuple[OpenAI, str]:
    if ALICEAI_API_KEY:
        kwargs = {"api_key": ALICEAI_API_KEY}
        if ALICEAI_BASE_URL:
            kwargs["base_url"] = ALICEAI_BASE_URL
        return OpenAI(**kwargs), ALICEAI_MODEL_URI
    if not OPENAI_API_KEY:
        raise ValueError("Missing ALICEAI_API_KEY or OPENAI_API_KEY")
    return OpenAI(api_key=OPENAI_API_KEY), "gpt-3.5-turbo"

def get_fairytale(message: str, message_count: int, is_named: bool = False) -> str:
    system_prompt = (
        "Ты — хранитель русских народных традиций и мастер сказочного повествования. "
        "Твоя задача — создавать волшебные сказки в духе русского фольклора, "
        "наполненные чудесами, добрыми уроками и яркими образами. Используй архаичный, "
        "но понятный язык, добавляй элементы природы, магии и традиционных персонажей."
    )
    if is_named:
        system_prompt += "\nСделай сказку именной — используй имя, которое предоставил пользователь, как главного героя."

    try:
        client, model = _build_ai_client()
        completion = client.chat.completions.create(
            model=model,
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
