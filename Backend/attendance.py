from fastapi import APIRouter, HTTPException
from database import attendance_col, employees_col
from models import Attendance

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/", status_code=201)
def mark_attendance(att: Attendance):
    if att.status not in ["Present", "Absent"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be Present or Absent"
        )

    if not employees_col.find_one({"emp_id": att.emp_id}):
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    attendance_col.update_one(
        {"emp_id": att.emp_id, "date": att.date},
        {"$set": att.dict()},
        upsert=True
    )

    return {"message": "Attendance marked successfully"}


@router.get("/{emp_id}")
def get_attendance(emp_id: str):
    if not employees_col.find_one({"emp_id": emp_id}):
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    records = list(
        attendance_col.find({"emp_id": emp_id}, {"_id": 0})
    )

    if not records:
        raise HTTPException(
            status_code=404,
            detail="No attendance records found"
        )

    return records
