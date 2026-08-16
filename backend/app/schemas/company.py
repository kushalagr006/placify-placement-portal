from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserOut


class CompanyProfileCreate(BaseModel):
    company_name: str
    hr_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    hr_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None


class CompanyOut(BaseModel):
    company_id: int
    user_id: int
    company_name: str
    hr_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_verified: bool
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True
