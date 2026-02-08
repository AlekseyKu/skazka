from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    extract_user_id,
    is_refresh_token,
    verify_telegram_init_data,
)
from app.schemas.auth import AuthInitData, AuthResponse, RefreshRequest, TokenPair
from app.schemas.user import UserRead
from app.services.user_service import get_or_create_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/telegram", response_model=AuthResponse)
async def login_via_telegram(payload: AuthInitData, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    if not settings.bot_token:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="BOT_TOKEN is not configured")

    try:
        init_data = verify_telegram_init_data(payload.init_data, settings.bot_token)
        user_id = extract_user_id(init_data)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    user = await get_or_create_user(session, user_id)
    tokens = TokenPair(
        access_token=create_access_token(user.user_id),
        refresh_token=create_refresh_token(user.user_id),
    )
    return AuthResponse(tokens=tokens, user=UserRead.model_validate(user))


@router.post("/refresh", response_model=TokenPair)
async def refresh_tokens(payload: RefreshRequest) -> TokenPair:
    if not is_refresh_token(payload.refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    try:
        claims = decode_token(payload.refresh_token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    return TokenPair(
        access_token=create_access_token(int(user_id)),
        refresh_token=create_refresh_token(int(user_id)),
    )
