from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.models import Skazka, Tale


async def create_tale(
    session: AsyncSession,
    user_id: int,
    text: str,
    audio_path: str | None,
    tale_type: str,
) -> Tale:
    tale = Tale(
        user_id=user_id,
        text=text,
        audio_path=audio_path,
        type=tale_type,
        date=datetime.now(timezone.utc),
    )
    session.add(tale)
    await session.commit()
    await session.refresh(tale)
    return tale


async def add_skazka(
    session: AsyncSession,
    text: str,
    audio_path: str | None,
    tale_type: str,
) -> Skazka:
    skazka = Skazka(text=text, audio_path=audio_path, type=tale_type)
    session.add(skazka)
    await session.commit()
    await session.refresh(skazka)
    return skazka


async def get_random_skazka(session: AsyncSession, tale_type: str) -> Skazka | None:
    result = await session.execute(
        select(Skazka).where(Skazka.type == tale_type).order_by(func.random()).limit(1)
    )
    return result.scalar_one_or_none()


async def delete_tale(session: AsyncSession, user_id: int, tale_id: int) -> bool:
    result = await session.execute(select(Tale).where(Tale.user_id == user_id, Tale.id == tale_id))
    tale = result.scalar_one_or_none()
    if not tale:
        return False
    await session.delete(tale)
    await session.commit()
    return True


async def set_tale_favorite(session: AsyncSession, user_id: int, tale_id: int, value: bool = True) -> Tale | None:
    result = await session.execute(select(Tale).where(Tale.user_id == user_id, Tale.id == tale_id))
    tale = result.scalar_one_or_none()
    if not tale:
        return None
    tale.is_favorite = value
    session.add(tale)
    await session.commit()
    await session.refresh(tale)
    return tale
