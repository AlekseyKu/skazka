from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    subscription: str
    subscription_end: datetime | None = None
    coins: int
    daily_limit: int
    audio_limit: int


class UserUpdate(BaseModel):
    subscription: str | None = None
    subscription_end: datetime | None = None
    coins: int | None = None
    daily_limit: int | None = None
    audio_limit: int | None = None
