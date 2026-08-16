from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.user import UserOut


class StudentProfileCreate(BaseModel):
    branch: str
    semester: int = Field(ge=1, le=8)
    cgpa: float = Field(ge=0.0, le=10.0)
    skills: Optional[str] = None
    phone: Optional[str] = None
    resume: Optional[str] = None


class StudentProfileUpdate(BaseModel):
    branch: Optional[str] = None
    semester: Optional[int] = Field(default=None, ge=1, le=8)
    cgpa: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    skills: Optional[str] = None
    phone: Optional[str] = None
    resume: Optional[str] = None


class StudentOut(BaseModel):
    student_id: int
    user_id: int
    branch: str
    semester: int
    cgpa: float
    skills: Optional[str] = None
    phone: Optional[str] = None
    resume: Optional[str] = None
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True
