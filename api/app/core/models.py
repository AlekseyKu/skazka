from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subscription: Mapped[str] = mapped_column(String(32), default="free")
    subscription_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    coins: Mapped[int] = mapped_column(Integer, default=0)
    daily_limit: Mapped[int] = mapped_column(Integer, default=1)
    audio_limit: Mapped[int] = mapped_column(Integer, default=3)

    tales: Mapped[list["Tale"]] = relationship(back_populates="user")
    stats: Mapped["Stats"] = relationship(back_populates="user", uselist=False)


class Tale(Base):
    __tablename__ = "tales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))
    text: Mapped[str] = mapped_column(Text)
    audio_path: Mapped[str | None] = mapped_column(String(512))
    type: Mapped[str] = mapped_column(String(32))
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="tales")


class Stats(Base):
    __tablename__ = "stats"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), primary_key=True)
    tts_minutes: Mapped[float] = mapped_column(Float, default=0.0)
    tales_count: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped[User] = relationship(back_populates="stats")


class Skazka(Base):
    __tablename__ = "skazki"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    text: Mapped[str] = mapped_column(Text)
    audio_path: Mapped[str | None] = mapped_column(String(512))
    type: Mapped[str] = mapped_column(String(32))
