from __future__ import annotations

import hmac
import json
from datetime import datetime, timedelta, timezone
from hashlib import sha256
from typing import Any
from urllib.parse import parse_qsl

from jose import JWTError, jwt

from app.core.config import settings


def create_access_token(user_id: int) -> str:
    return _create_token(user_id, token_type="access", expires_delta=timedelta(minutes=settings.jwt_access_token_expire_minutes))


def create_refresh_token(user_id: int) -> str:
    return _create_token(user_id, token_type="refresh", expires_delta=timedelta(days=settings.jwt_refresh_token_expire_days))


def _create_token(user_id: int, token_type: str, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "type": token_type,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])


def verify_telegram_init_data(init_data: str, bot_token: str, max_age_seconds: int = 86400) -> dict[str, Any]:
    data = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = data.pop("hash", None)
    if not received_hash:
        raise ValueError("Missing hash")

    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(data.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), sha256).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode(), sha256).hexdigest()
    if not hmac.compare_digest(calculated_hash, received_hash):
        raise ValueError("Invalid hash")

    auth_date = data.get("auth_date")
    if auth_date:
        now = int(datetime.now(timezone.utc).timestamp())
        if now - int(auth_date) > max_age_seconds:
            raise ValueError("initData expired")

    user_payload = data.get("user")
    if user_payload:
        data["user"] = json.loads(user_payload)

    return data


def extract_user_id(init_data: dict[str, Any]) -> int:
    user = init_data.get("user") or {}
    user_id = user.get("id")
    if not user_id:
        raise ValueError("User id missing")
    return int(user_id)


def is_refresh_token(token: str) -> bool:
    try:
        payload = decode_token(token)
    except JWTError:
        return False
    return payload.get("type") == "refresh"
