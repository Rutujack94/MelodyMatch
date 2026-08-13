from fastapi import APIRouter, Query

from app.models.schemas import SearchResponse
from app.services import recommendation_service as svc

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResponse)
def search(
    q: str = Query("", description="Search text, matched against track and artist name."),
    limit: int = Query(10, ge=1, le=50),
):
    results = svc.search_songs(q, limit=limit)
    return SearchResponse(query=q, count=len(results), results=results)
