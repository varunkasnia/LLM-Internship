"""Employee model."""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    department = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
