from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel
from app.schemas.student import StudentOut
from app.schemas.job import JobOut


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationStatusUpdate(BaseModel):
    status: Literal["Applied", "Shortlisted", "Selected", "Rejected"]


class ApplicationOut(BaseModel):
    application_id: int
    student_id: int
    job_id: int
    applied_date: datetime
    status: str
    student: Optional[StudentOut] = None
    job: Optional[JobOut] = None

    class Config:
        from_attributes = True
