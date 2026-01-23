from pydantic import BaseModel


class UserRead(BaseModel):
    user_id: int
    subscription: str
    subscription_end: str | None = None
    coins: int
    daily_limit: int
    audio_limit: int
