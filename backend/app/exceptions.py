"""Centralized exception handling."""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Return 422 with clear validation errors."""
    errors = exc.errors()
    messages = []
    for e in errors:
        loc = ".".join(str(x) for x in e["loc"] if x != "body")
        messages.append(f"{loc}: {e['msg']}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": " ".join(messages) or "Validation error"},
    )


async def integrity_exception_handler(request: Request, exc: IntegrityError):
    """Handle unique constraint / FK violations."""
    msg = str(exc.orig) if hasattr(exc, "orig") else str(exc)
    if "UNIQUE" in msg or "unique" in msg or "duplicate" in msg.lower():
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={"detail": "Employee ID or record already exists."},
        )
    if "FOREIGN KEY" in msg or "foreign key" in msg.lower():
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": "Employee not found."},
        )
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Database constraint error."},
    )
