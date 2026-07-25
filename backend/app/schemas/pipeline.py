from pydantic import BaseModel


class PipelineCreate(BaseModel):
    name: str
    owner: str
    schedule: str
    status: str


class PipelineResponse(PipelineCreate):
    id: int

    class Config:
        from_attributes = True