import os
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_TOKEN = os.getenv("BOT_TOKEN")
XAI_API_KEY = os.getenv("AI_TOKEN")
YANDEX_API_KEY = os.getenv("YANDEX_API_KEY")
YANDEX_FOLDER_ID = os.getenv("YANDEX_FOLDER_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ALICEAI_API_KEY = os.getenv("ALICEAI_API_KEY")
ALICEAI_BASE_URL = os.getenv("ALICEAI_BASE_URL")
ALICEAI_MODEL_URI = os.getenv("ALICEAI_MODEL_URI", "gpt://b1gc1of1a12n9rjct0qv/aliceai-llm/latest")
ADMIN_ID = int(os.getenv("ADMIN_ID", 0))
WEBAPP_URL = os.getenv("WEBAPP_URL")

# Проверка на наличие токенов
required = [TELEGRAM_TOKEN, YANDEX_API_KEY, YANDEX_FOLDER_ID]
if not all(required):
    raise ValueError("❌ Отсутствуют переменные окружения в .env")
if not (OPENAI_API_KEY or ALICEAI_API_KEY):
    raise ValueError("❌ Нужен OPENAI_API_KEY или ALICEAI_API_KEY")

# Каталог для аудио
AUDIO_DIR = "audio_files"
os.makedirs(AUDIO_DIR, exist_ok=True)
