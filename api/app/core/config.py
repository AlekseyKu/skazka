from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    api_title: str = "Skazka API"
    cors_origins: List[str] = []
    environment: str = "development"
    debug: bool = True

    bot_token: str | None = None
    admin_id: str | None = None

    openai_api_key: str | None = None
    ai_token: str | None = None
    yandex_api_key: str | None = None
    yandex_folder_id: str | None = None
    elevenlabs_api_key: str | None = None
    u_kassa_api: str | None = None

    database_url: str | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors_origins(cls, value: str | List[str] | None) -> List[str]:
        if value is None:
            return []
        if isinstance(value, list):
            return value
        return [item.strip() for item in value.split(",") if item.strip()]


settings = Settings()
