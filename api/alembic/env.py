from __future__ import with_statement

import asyncio
import sys
from pathlib import Path

from alembic import context
from sqlalchemy.ext.asyncio import async_engine_from_config

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.core.database import Base
from app.core import models  # noqa: F401


config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url or "")

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=settings.database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        {"sqlalchemy.url": settings.database_url},
        prefix="sqlalchemy.",
        poolclass=None,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations() -> None:
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        asyncio.run(run_migrations_online())


run_migrations()
