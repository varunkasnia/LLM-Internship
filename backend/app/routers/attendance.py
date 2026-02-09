"""Attendance API."""
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models import Employee, Attendance
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceRecord,
    AttendanceListResponse,
)

router = APIRouter(prefix="/attendance", tags=["attendance"])


def _attendance_to_record(a: Attendance) -> AttendanceRecord:
    return AttendanceRecord(
        id=a.id,
        date=a.date,
        status=a.status,
        created_at=a.created_at,
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee on a date. One record per employee per date."""
    employee = db.query(Employee).filter(Employee.employee_id == data.employee_id.strip()).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    att = Attendance(
        employee_id=employee.id,
        date=data.date,
        status=data.status.strip(),
    )
    try:
        db.add(att)
        db.commit()
        db.refresh(att)
        return {
            "id": att.id,
            "employee_id": data.employee_id,
            "date": str(att.date),
            "status": att.status,
            "created_at": att.created_at.isoformat() if att.created_at else None,
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already marked for this employee on this date.",
        )


@router.get("/{employee_id}")
def get_attendance_by_employee(
    employee_id: str,
    from_date: date | None = Query(None, alias="from_date"),
    to_date: date | None = Query(None, alias="to_date"),
    db: Session = Depends(get_db),
):
    """Get attendance records for an employee. Optional filter by from_date and to_date."""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    q = db.query(Attendance).filter(Attendance.employee_id == employee.id)
    if from_date:
        q = q.filter(Attendance.date >= from_date)
    if to_date:
        q = q.filter(Attendance.date <= to_date)
    records = q.order_by(Attendance.date.desc()).all()
    present = sum(1 for r in records if r.status == "Present")
    absent = sum(1 for r in records if r.status == "Absent")
    return AttendanceListResponse(
        employee_id=employee.employee_id,
        employee_name=employee.full_name,
        records=[_attendance_to_record(r) for r in records],
        total_present=present,
        total_absent=absent,
        total=len(records),
    )


@router.get("")
def list_attendance_summary(
    on_date: date | None = Query(None, alias="on_date"),
    db: Session = Depends(get_db),
):
    """Optional: list attendance summary - all records for a given date or recent."""
    if on_date:
        # All attendance for this date (join employees to get employee_id string)
        rows = (
            db.query(Attendance, Employee)
            .join(Employee, Attendance.employee_id == Employee.id)
            .filter(Attendance.date == on_date)
            .order_by(Employee.employee_id)
            .all()
        )
        return {
            "date": str(on_date),
            "records": [
                {
                    "id": att.id,
                    "employee_id": emp.employee_id,
                    "employee_name": emp.full_name,
                    "date": str(att.date),
                    "status": att.status,
                }
                for att, emp in rows
            ],
            "total": len(rows),
        }
    # Recent attendance (last 50)
    rows = (
        db.query(Attendance, Employee)
        .join(Employee, Attendance.employee_id == Employee.id)
        .order_by(Attendance.date.desc(), Attendance.id.desc())
        .limit(50)
        .all()
    )
    return {
        "records": [
            {
                "id": att.id,
                "employee_id": emp.employee_id,
                "employee_name": emp.full_name,
                "date": str(att.date),
                "status": att.status,
            }
            for att, emp in rows
        ],
        "total": len(rows),
    }
