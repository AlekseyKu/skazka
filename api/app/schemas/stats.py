from pydantic import BaseModel, ConfigDict


class UserStatsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tts_minutes: float
    tales_count: int
