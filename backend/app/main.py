"""HRMS Lite API - Main application."""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import get_db
from sqlalchemy.exc import IntegrityError

from app.database import init_db
from app.exceptions import validation_exception_handler, integrity_exception_handler
from app.routers import employees, attendance
from fastapi.exceptions import RequestValidationError


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    # shutdown if needed


app = FastAPI(
    title="HRMS Lite API",
    description="Lightweight HRMS - Employees & Attendance",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_exception_handler)

app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/")
def root():
    return {"message": "HRMS Lite API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


# Dashboard summary
@app.get("/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):
    from app.models import Employee, Attendance

    total_employees = db.query(Employee).count()
    total_records = db.query(Attendance).count()
    present_count = db.query(Attendance).filter(Attendance.status == "Present").count()
    absent_count = db.query(Attendance).filter(Attendance.status == "Absent").count()
    return {
        "total_employees": total_employees,
        "total_attendance_records": total_records,
        "total_present": present_count,
        "total_absent": absent_count,
    }
