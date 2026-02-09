"""Attendance request/response schemas."""
from datetime import date, datetime
from pydantic import BaseModel, Field


class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Employee ID (string)")
    date: date
    status: str = Field(..., pattern="^(Present|Absent)$")


class AttendanceResponse(BaseModel):
    id: int
    employee_id: int  # DB FK
    employee_employee_id: str  # human-readable ID
    date: date
    status: str
    created_at: datetime | None

    class Config:
        from_attributes = True


class AttendanceRecord(BaseModel):
    id: int
    date: date
    status: str
    created_at: datetime | None

    class Config:
        from_attributes = True


class AttendanceListResponse(BaseModel):
    employee_id: str
    employee_name: str
    records: list[AttendanceRecord]
    total_present: int
    total_absent: int
    total: int
