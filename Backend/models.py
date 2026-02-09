from pydantic import BaseModel, EmailStr


class Employee(BaseModel):
    emp_id: str
    name: str
    email: EmailStr
    department: str


class Attendance(BaseModel):
    emp_id: str
    date: str
    status: str
