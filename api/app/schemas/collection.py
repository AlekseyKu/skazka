from pydantic import BaseModel


class CollectionItemRead(BaseModel):
    id: int
    text: str
    audio_path: str | None = None
    type: str
    date: str
