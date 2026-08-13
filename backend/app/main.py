import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.models.schemas import HealthResponse, RootResponse
from app.routes import recommendations, search, songs
from app.utils.model_loader import ModelLoadError, load_models

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("melodymatch")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ~35 MB of model artifacts exactly once, at process startup,
    # never per-request.
    try:
        load_models()
    except ModelLoadError:
        logger.exception("Model artifacts failed to load at startup")
        # Don't crash the process - individual requests will return a clean
        # 503 via the exception handler below instead of the server refusing
        # to boot at all.
    yield


app = FastAPI(
    title="MelodyMatch API",
    description="Content-based music recommendation API powered by TF-IDF + NearestNeighbors.",
    version="1.0.0",
    lifespan=lifespan,
)

_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.exception_handler(ModelLoadError)
async def model_load_error_handler(_request, exc: ModelLoadError):
    logger.error("Model load error: %s", exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Recommendation service is currently unavailable. Please try again later."},
    )


app.include_router(search.router)
app.include_router(recommendations.router)
app.include_router(songs.router)


@app.get("/", response_model=RootResponse)
def root():
    return RootResponse(message="MelodyMatch API is running")


@app.get("/health", response_model=HealthResponse)
def health():
    try:
        load_models()
    except ModelLoadError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return HealthResponse(status="healthy")
