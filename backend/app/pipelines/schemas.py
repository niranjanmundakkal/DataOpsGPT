from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class PipelineCreate(BaseModel):
    name: str
    owner: str
    schedule: str
    status: str

class PipelineUpdate(BaseModel):
    name: Optional[str] = None
    owner: Optional[str] = None
    schedule: Optional[str] = None
    status: Optional[str] = None

class PipelineResponse(PipelineCreate):
    id: int

    class Config:
        from_attributes = True

class PipelineRunBase(BaseModel):
    pipeline_id: int
    status: str
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

class PipelineRunCreate(PipelineRunBase):
    pass

class PipelineRunResponse(PipelineRunBase):
    id: int

    class Config:
        from_attributes = True

class LineageCreate(BaseModel):
    pipeline_name: str
    table_name: str
    dashboard_name: str
    owner_name: str

