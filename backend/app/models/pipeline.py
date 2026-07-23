from sqlalchemy import Column, Integer, String

from app.database.database import Base


class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner = Column(String)
    status = Column(String)
    schedule = Column(String)