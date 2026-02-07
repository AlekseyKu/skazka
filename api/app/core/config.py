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
    aliceai_api_key: str | None = None
    aliceai_base_url: str | None = None
    aliceai_model_uri: str = "gpt://b1gc1of1a12n9rjct0qv/aliceai-llm/latest"
    ai_token: str | None = None
    yandex_api_key: str | None = None
    yandex_folder_id: str | None = None
    elevenlabs_api_key: str | None = None
    u_kassa_api: str | None = None

    audio_files_dir: str = "./audio_files"

    database_url: str | None = None

    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.cors_origins:
            return []
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


settings = Settings()
