from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserRead


class AuthInitData(BaseModel):
    init_data: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tokens: TokenPair
    user: UserRead
