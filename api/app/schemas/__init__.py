"""Pydantic schemas."""

from .auth import AuthInitData, AuthResponse, RefreshRequest, TokenPair
from .collection import CollectionItemRead
from .stats import UserStatsRead
from .tale import GenerateNamedTaleRequest, GenerateNightTaleRequest, GenerateTaleRequest, TaleRead
from .user import UserRead, UserUpdate

__all__ = [
    "AuthInitData",
    "AuthResponse",
    "RefreshRequest",
    "TokenPair",
    "CollectionItemRead",
    "UserStatsRead",
    "GenerateNamedTaleRequest",
    "GenerateNightTaleRequest",
    "GenerateTaleRequest",
    "TaleRead",
    "UserRead",
    "UserUpdate",
]
