from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from app.search.retriever import retrieve
from app.auth.jwt import get_current_user
from app.auth.models import User

router = APIRouter(tags=["Search"], dependencies=[Depends(get_current_user)])


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search(body: Optional[SearchRequest] = None, query: Optional[str] = None):
    search_term = body.query if body else (query or "")
    results = retrieve(search_term)
    return [result.payload for result in results]
