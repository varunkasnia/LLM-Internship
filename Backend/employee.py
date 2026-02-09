from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError
from database import employees_col, attendance_col
from models import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/", status_code=201)
def add_employee(emp: Employee):
    try:
        employees_col.insert_one(emp.dict())
        return {"message": "Employee added successfully"}

    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Employee ID already exists"
        )


@router.get("/")
def get_employees():
    return list(employees_col.find({}, {"_id": 0}))


@router.delete("/{emp_id}")
def delete_employee(emp_id: str):
    result = employees_col.delete_one({"emp_id": emp_id})
    attendance_col.delete_many({"emp_id": emp_id})

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {"message": "Employee deleted successfully"}
