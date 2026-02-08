from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CollectionItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    audio_path: str | None = None
    type: str
    date: datetime
    is_favorite: bool = False