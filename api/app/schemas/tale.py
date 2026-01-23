from pydantic import BaseModel


class TaleRead(BaseModel):
    id: int
    text: str
    audio_path: str | None = None
    type: str
    date: str
