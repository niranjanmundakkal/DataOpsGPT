from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Pipeline(Base):
    __tablename__ = "pipelines"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(100))

    owner: Mapped[str] = mapped_column(String(100))

    schedule: Mapped[str] = mapped_column(String(100))

    status: Mapped[str] = mapped_column(String(30))