"""Employee CRUD API."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeListResponse

router = APIRouter(prefix="/employees", tags=["employees"])


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    """Add a new employee. Returns 409 if employee_id or email is duplicate."""
    employee = Employee(
        employee_id=data.employee_id.strip(),
        full_name=data.full_name.strip(),
        email=data.email.strip().lower(),
        department=data.department.strip(),
    )
    try:
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Employee ID or email already exists.",
        )


@router.get("", response_model=EmployeeListResponse)
def list_employees(db: Session = Depends(get_db)):
    """List all employees."""
    employees = db.query(Employee).order_by(Employee.created_at.desc()).all()
    return EmployeeListResponse(employees=employees, total=len(employees))


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete employee by employee_id (string ID)."""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )
    db.delete(employee)
    db.commit()
    return None
