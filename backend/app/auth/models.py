from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="VIEWER", nullable=False)  # Roles: ADMIN, DATA_ENGINEER, VIEWER
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
