from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.company import Company
from app.models.job import Job
from app.models.announcement import Announcement
from app.schemas.student import StudentOut
from app.schemas.company import CompanyOut
from app.schemas.job import JobOut
from app.schemas.announcement import AnnouncementCreate, AnnouncementOut
from app.security import require_role

router = APIRouter(prefix="/admin", tags=["Admin Endpoints"])

# Role Dependency: Only admin users can access admin endpoints
require_admin = require_role(["admin"])


@router.get("/students", response_model=List[StudentOut])
def get_all_students(
    db: Session = Depends(get_db), current_user: User = Depends(require_admin)
):
    """Retrieve all student profiles for placement administration."""
    students = db.query(Student).all()
    return students


@router.get("/companies", response_model=List[CompanyOut])
def get_all_companies(
    db: Session = Depends(get_db), current_user: User = Depends(require_admin)
):
    """Retrieve all registered companies."""
    companies = db.query(Company).all()
    return companies


@router.get("/jobs", response_model=List[JobOut])
def get_all_jobs(
    db: Session = Depends(get_db), current_user: User = Depends(require_admin)
):
    """Retrieve all posted jobs across companies."""
    jobs = db.query(Job).all()
    return jobs


@router.post(
    "/announcements",
    response_model=AnnouncementOut,
    status_code=status.HTTP_201_CREATED,
)
def create_announcement(
    data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Create a new campus placement announcement."""
    announcement = Announcement(
        title=data.title,
        description=data.description,
        created_by=current_user.id,
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


@router.get("/announcements", response_model=List[AnnouncementOut])
def get_all_announcements(db: Session = Depends(get_db)):
    """Public/Global endpoint: Fetch all placement announcements."""
    announcements = (
        db.query(Announcement)
        .order_by(Announcement.created_at.desc())
        .all()
    )
    return announcements


@router.delete("/announcements/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete an announcement by ID."""
    announcement = (
        db.query(Announcement).filter(Announcement.announcement_id == id).first()
    )
    if not announcement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found"
        )

    db.delete(announcement)
    db.commit()
    return None
