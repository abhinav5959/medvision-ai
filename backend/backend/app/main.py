from fastapi import FastAPI, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import orthopedics
from app.utils.exceptions import (
    APIException, api_exception_handler, 
    validation_exception_handler, starlette_http_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Sequential loading is used to fit in 512MB RAM, eager load disabled
    yield

app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers for structured error outputs
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, starlette_http_exception_handler)

# Add deployment health check endpoints
@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": settings.API_TITLE}

@app.get("/readiness", tags=["System"])
def readiness_check():
    # In a real scenario, this might check model weights or DB
    return {"status": "ready"}
# Include the core domain routers
app.include_router(orthopedics.router)

# Backwards compatibility route for older frontend clients
@app.post("/api/diagnose", include_in_schema=False)
async def legacy_diagnose(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="Digital X-ray scan image (PNG/JPG/JPEG)")
):
    """Legacy route mapping /api/diagnose directly to the new API endpoint."""
    return await orthopedics.analyze_orthopedics(background_tasks=background_tasks, file=file)
