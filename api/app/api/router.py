from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.collection import router as collection_router
from app.api.v1.tales import router as tales_router
from app.api.v1.users import router as users_router


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(tales_router)
api_router.include_router(collection_router)