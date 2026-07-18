from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

class APIException(Exception):
    """Custom API base exception to return structured errors to the client."""
    def __init__(self, error_code: str, message: str, possible_solution: str, status_code: int = 400):
        self.error_code = error_code
        self.message = message
        self.possible_solution = possible_solution
        self.status_code = status_code
        super().__init__(message)

async def api_exception_handler(request: Request, exc: APIException):
    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.message,
            "possible_solution": exc.possible_solution
        }
    )
    # Add CORS header manually since exception handlers bypass middleware
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors_str = "; ".join([f"{'.'.join(str(loc) for loc in err['loc'])}: {err['msg']}" for err in exc.errors()])
    response = JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "message": f"Input validation failed: {errors_str}",
            "possible_solution": "Ensure that the uploaded fields and types match the API schema."
        }
    )
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException):
    solutions = {
        404: "Verify that the path exists and matches the API version (e.g. /api/v1/orthopedics/analyze).",
        405: "Ensure the correct HTTP method (e.g. POST) is used for the requested route.",
        413: "Verify that the uploaded image size does not exceed server limits.",
        500: "Ensure the API environment keys are configured and PyTorch weights loaded."
    }
    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": f"HTTP_ERROR_{exc.status_code}",
            "message": exc.detail,
            "possible_solution": solutions.get(exc.status_code, "Review server log files for traceback information.")
        }
    )
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response
