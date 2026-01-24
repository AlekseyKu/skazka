from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TaleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    audio_path: str | None = None
    type: str
    date: datetime


class GenerateTaleRequest(BaseModel):
    theme: str
    with_audio: bool = False


class GenerateNamedTaleRequest(BaseModel):
    name: str
    with_audio: bool = False


class GenerateNightTaleRequest(BaseModel):
    with_audio: bool = False
