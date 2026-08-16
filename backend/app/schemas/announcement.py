from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.user import UserOut


class AnnouncementCreate(BaseModel):
    title: str
    description: str


class AnnouncementOut(BaseModel):
    announcement_id: int
    title: str
    description: str
    created_by: Optional[int] = None
    created_at: datetime
    creator: Optional[UserOut] = None

    class Config:
        from_attributes = True
