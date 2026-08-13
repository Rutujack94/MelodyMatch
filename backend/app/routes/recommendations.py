from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import RecommendationResponse
from app.services import recommendation_service as svc

router = APIRouter(tags=["recommendations"])


@router.get("/recommend", response_model=RecommendationResponse)
def recommend(
    track_name: str = Query("", description="Title of the song to base recommendations on."),
    n: int = Query(5, ge=1, le=50, description="Number of recommendations to return."),
    song_id: int | None = Query(
        None, description="Optional dataset id to disambiguate same-titled tracks."
    ),
):
    try:
        query_song, recs = svc.get_recommendations(track_name, n=n, song_id=song_id)
    except svc.SongNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return RecommendationResponse(query_song=query_song, recommendations=recs)
