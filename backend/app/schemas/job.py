from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel
from app.schemas.company import CompanyOut


class JobCreate(BaseModel):
    title: str
    description: str
    package: Optional[str] = None
    location: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: date


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    package: Optional[str] = None
    location: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[Literal["Active", "Closed"]] = None


class JobOut(BaseModel):
    job_id: int
    company_id: int
    title: str
    description: str
    package: Optional[str] = None
    location: Optional[str] = None
    eligibility: Optional[str] = None
    deadline: date
    status: str
    company: Optional[CompanyOut] = None

    class Config:
        from_attributes = True
