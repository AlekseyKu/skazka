from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    api_title: str = "Skazka API"
    cors_origins: str = ""
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

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.cors_origins:
            return []
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


settings = Settings()
