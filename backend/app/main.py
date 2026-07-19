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
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        from fastapi.responses import Response
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Register custom exception handlers for structured error outputs
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, starlette_http_exception_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": str(exc),
            "traceback": traceback.format_exc()
        }
    )

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
