from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.models import Stats, Tale, User


async def get_user_by_id(session: AsyncSession, user_id: int) -> User | None:
    result = await session.execute(select(User).where(User.user_id == user_id))
    return result.scalar_one_or_none()


async def get_or_create_user(session: AsyncSession, user_id: int) -> User:
    user = await get_user_by_id(session, user_id)
    if user:
        return user
    user = User(user_id=user_id)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_user_stats(session: AsyncSession, user_id: int) -> Stats | None:
    result = await session.execute(select(Stats).where(Stats.user_id == user_id))
    return result.scalar_one_or_none()


async def update_user_profile(session: AsyncSession, user: User, **fields) -> User:
    for key, value in fields.items():
        if value is not None:
            setattr(user, key, value)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def list_user_tales(session: AsyncSession, user_id: int, limit: int = 50) -> list[Tale]:
    result = await session.execute(
        select(Tale).where(Tale.user_id == user_id).order_by(Tale.date.desc()).limit(limit)
    )
    return list(result.scalars().all())


async def get_tale_by_id(session: AsyncSession, user_id: int, tale_id: int) -> Tale | None:
    result = await session.execute(select(Tale).where(Tale.user_id == user_id, Tale.id == tale_id))
    return result.scalar_one_or_none()
