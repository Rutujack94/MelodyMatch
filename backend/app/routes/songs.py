from fastapi import APIRouter, HTTPException

from app.models.schemas import SongDetail
from app.services import recommendation_service as svc

router = APIRouter(tags=["songs"])


@router.get("/song/{song_id}", response_model=SongDetail)
def get_song(song_id: int):
    try:
        return svc.get_song(song_id)
    except svc.SongNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
