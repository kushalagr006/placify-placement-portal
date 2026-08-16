from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.student import Student
from app.models.job import Job
from app.models.application import Application
from app.schemas.job import JobOut
from app.schemas.application import ApplicationOut
from app.schemas.student import StudentOut, StudentProfileCreate, StudentProfileUpdate
from app.security import require_role

router = APIRouter(prefix="/student", tags=["Student Endpoints"])

# Role Dependency: Only students can access student endpoints
require_student = require_role(["student"])


@router.get("/jobs", response_model=List[JobOut])
def get_active_jobs(
    db: Session = Depends(get_db), current_user: User = Depends(require_student)
):
    """Get list of active job postings."""
    jobs = db.query(Job).filter(Job.status == "Active").all()
    return jobs


@router.post(
    "/jobs/{id}/apply",
    response_model=ApplicationOut,
    status_code=status.HTTP_201_CREATED,
)
def apply_for_job(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    """Apply for a job posting."""
    # Ensure student profile exists
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete your student profile before applying for jobs.",
        )

    # Ensure job exists and is Active
    job = db.query(Job).filter(Job.job_id == id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )
    if job.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This job posting is no longer active",
        )

    # Check for existing application
    existing_app = (
        db.query(Application)
        .filter(
            Application.student_id == student.student_id, Application.job_id == id
        )
        .first()
    )
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied for this job",
        )

    new_application = Application(
        student_id=student.student_id, job_id=id, status="Applied"
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application


@router.get("/applications", response_model=List[ApplicationOut])
def get_my_applications(
    db: Session = Depends(get_db), current_user: User = Depends(require_student)
):
    """Get all applications submitted by the logged-in student."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []

    applications = (
        db.query(Application)
        .filter(Application.student_id == student.student_id)
        .all()
    )
    return applications


@router.get("/profile", response_model=StudentOut)
def get_student_profile(
    db: Session = Depends(get_db), current_user: User = Depends(require_student)
):
    """Fetch current student's profile details."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        # Create empty profile shell if none exists yet
        student = Student(
            user_id=current_user.id,
            branch="Computer Science",
            semester=8,
            cgpa=8.5,
            skills="React, JavaScript, SQL",
            phone="",
            resume="resume.pdf"
        )
        db.add(student)
        db.commit()
        db.refresh(student)
    return student


@router.put("/profile", response_model=StudentOut)
def create_or_update_student_profile(
    profile_data: StudentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_student),
):
    """Create or update current student's profile."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()

    if not student:
        # Create profile if it doesn't exist
        branch = profile_data.branch or "General"
        semester = profile_data.semester or 1
        cgpa = profile_data.cgpa if profile_data.cgpa is not None else 0.0
        student = Student(
            user_id=current_user.id,
            branch=branch,
            semester=semester,
            cgpa=cgpa,
            skills=profile_data.skills,
            phone=profile_data.phone,
            resume=profile_data.resume,
        )
        db.add(student)
    else:
        # Update existing profile fields
        update_data = profile_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if value is not None:
                setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student
