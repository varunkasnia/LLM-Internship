"""Employee request/response schemas."""
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee ID")
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime | None

    class Config:
        from_attributes = True


class EmployeeListResponse(BaseModel):
    employees: list[EmployeeResponse]
    total: int
