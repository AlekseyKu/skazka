from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.schemas.tale import (
    GenerateNamedTaleRequest,
    GenerateNightTaleRequest,
    GenerateTaleRequest,
    TaleRead,
)
from app.services.ai_service import generate_fairytale, synthesize_voice
from app.services.tale_service import add_skazka, create_tale, get_random_skazka
from app.services.user_service import get_tale_by_id, list_user_tales


router = APIRouter(prefix="/tales", tags=["tales"])


@router.get("", response_model=list[TaleRead])
async def list_tales(
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> list[TaleRead]:
    tales = await list_user_tales(session, current_user.user_id)
    return [TaleRead.model_validate(tale) for tale in tales]


@router.get("/{tale_id}", response_model=TaleRead)
async def get_tale(
    tale_id: int,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> TaleRead:
    tale = await get_tale_by_id(session, current_user.user_id, tale_id)
    if not tale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tale not found")
    return TaleRead.model_validate(tale)


@router.post("/generate", response_model=TaleRead)
async def generate_tale(
    payload: GenerateTaleRequest,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> TaleRead:
    if not payload.theme.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Theme is required")
    message_count = int(datetime.now().timestamp()) % 100000
    try:
        text = generate_fairytale(payload.theme, message_count)
        audio_path = synthesize_voice(text) if payload.with_audio else None
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    tale_type = "audio" if audio_path else "text"
    tale = await create_tale(session, current_user.user_id, text, audio_path, tale_type)
    await add_skazka(session, text, audio_path, tale_type)
    return TaleRead.model_validate(tale)


@router.post("/generate/named", response_model=TaleRead)
async def generate_named_tale(
    payload: GenerateNamedTaleRequest,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> TaleRead:
    if not payload.name.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Name is required")
    message_count = int(datetime.now().timestamp()) % 100000
    try:
        text = generate_fairytale(payload.name, message_count, is_named=True)
        audio_path = synthesize_voice(text) if payload.with_audio else None
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    tale_type = "named_audio" if audio_path else "named"
    tale = await create_tale(session, current_user.user_id, text, audio_path, tale_type)
    await add_skazka(session, text, audio_path, tale_type)
    return TaleRead.model_validate(tale)


@router.post("/generate/night", response_model=TaleRead)
async def generate_night_tale(
    payload: GenerateNightTaleRequest,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> TaleRead:
    theme = "успокаивающая сказка перед сном для ребёнка"
    message_count = int(datetime.now().timestamp()) % 100000
    try:
        text = generate_fairytale(theme, message_count)
        audio_path = synthesize_voice(text) if payload.with_audio else None
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc

    tale_type = "night_audio" if audio_path else "night"
    tale = await create_tale(session, current_user.user_id, text, audio_path, tale_type)
    await add_skazka(session, text, audio_path, tale_type)
    return TaleRead.model_validate(tale)


@router.get("/random", response_model=TaleRead)
async def random_tale(
    tale_type: str = Query(default="text", pattern="^[a-z_]+$"),
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> TaleRead:
    skazka = await get_random_skazka(session, tale_type)
    if not skazka:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No tales available")

    tale = await create_tale(session, current_user.user_id, skazka.text, skazka.audio_path, skazka.type)
    return TaleRead.model_validate(tale)
