from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.schemas.collection import CollectionItemRead
from app.services.user_service import get_tale_by_id, list_user_tales


router = APIRouter(prefix="/collection", tags=["collection"])


@router.get("", response_model=list[CollectionItemRead])
async def list_collection(
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> list[CollectionItemRead]:
    tales = await list_user_tales(session, current_user.user_id)
    return [CollectionItemRead.model_validate(tale) for tale in tales]


@router.get("/{tale_id}", response_model=CollectionItemRead)
async def get_collection_item(
    tale_id: int,
    session: AsyncSession = Depends(get_session),
    current_user=Depends(get_current_user),
) -> CollectionItemRead:
    tale = await get_tale_by_id(session, current_user.user_id, tale_id)
    if not tale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return CollectionItemRead.model_validate(tale)
