from fastapi import APIRouter, Depends

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.schemas.stats import UserStatsRead
from app.schemas.user import UserRead, UserUpdate
from app.services.user_service import get_user_stats, update_user_profile


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def get_me(current_user=Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.get("/me/stats", response_model=UserStatsRead)
async def get_my_stats(current_user=Depends(get_current_user), session=Depends(get_session)) -> UserStatsRead:
    stats = await get_user_stats(session, current_user.user_id)
    if not stats:
        return UserStatsRead(tts_minutes=0.0, tales_count=0)
    return UserStatsRead.model_validate(stats)


@router.patch("/me", response_model=UserRead)
async def update_me(
    payload: UserUpdate,
    current_user=Depends(get_current_user),
    session=Depends(get_session),
) -> UserRead:
    updated_user = await update_user_profile(
        session,
        current_user,
        subscription=payload.subscription,
        subscription_end=payload.subscription_end,
        coins=payload.coins,
        daily_limit=payload.daily_limit,
        audio_limit=payload.audio_limit,
    )
    return UserRead.model_validate(updated_user)
