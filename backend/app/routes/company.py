from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.company import Company
from app.models.job import Job
from app.models.application import Application
from app.schemas.job import JobCreate, JobUpdate, JobOut
from app.schemas.company import CompanyOut, CompanyProfileCreate, CompanyProfileUpdate
from app.schemas.application import ApplicationOut, ApplicationStatusUpdate
from app.security import require_role

router = APIRouter(prefix="/company", tags=["Company Endpoints"])

# Role Dependency: Only company users can access company endpoints
require_company = require_role(["company"])


def get_current_company(current_user: User, db: Session) -> Company:
    """Helper to retrieve company profile or create initial profile."""
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        company = Company(
            user_id=current_user.id,
            company_name="",
            hr_name=current_user.name,
            website="",
            location="Remote / Onsite",
            description="Official Hiring Partner",
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company


@router.post("/jobs", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Create a new job posting for the company."""
    company = get_current_company(current_user, db)
    new_job = Job(
        company_id=company.company_id,
        title=job_data.title,
        description=job_data.description,
        package=job_data.package,
        location=job_data.location,
        eligibility=job_data.eligibility,
        deadline=job_data.deadline,
        status="Active",
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@router.get("/jobs", response_model=List[JobOut])
def get_company_jobs(
    db: Session = Depends(get_db), current_user: User = Depends(require_company)
):
    """Get all job postings created by the company."""
    company = get_current_company(current_user, db)
    jobs = db.query(Job).filter(Job.company_id == company.company_id).all()
    return jobs


@router.put("/jobs/{id}", response_model=JobOut)
def update_job(
    id: int,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Update a job posting."""
    company = get_current_company(current_user, db)
    job = (
        db.query(Job)
        .filter(Job.job_id == id, Job.company_id == company.company_id)
        .first()
    )
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )

    update_dict = job_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job


@router.delete("/jobs/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Delete a job posting."""
    company = get_current_company(current_user, db)
    job = (
        db.query(Job)
        .filter(Job.job_id == id, Job.company_id == company.company_id)
        .first()
    )
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )

    db.delete(job)
    db.commit()
    return None


@router.get("/applications", response_model=List[ApplicationOut])
def get_all_company_applications(
    db: Session = Depends(get_db), current_user: User = Depends(require_company)
):
    """Get all student applications submitted to any job posted by this company."""
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        return []

    applications = (
        db.query(Application)
        .join(Job, Application.job_id == Job.job_id)
        .filter(Job.company_id == company.company_id)
        .all()
    )
    return applications


@router.get("/jobs/{id}/applications", response_model=List[ApplicationOut])
def get_job_applications(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Get all student applications for a specific job."""
    company = get_current_company(current_user, db)
    job = (
        db.query(Job)
        .filter(Job.job_id == id, Job.company_id == company.company_id)
        .first()
    )
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found"
        )

    applications = db.query(Application).filter(Application.job_id == id).all()
    return applications


@router.put("/applications/{id}/status", response_model=ApplicationOut)
def update_application_status(
    id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Update application status (Applied, Shortlisted, Selected, Rejected)."""
    company = get_current_company(current_user, db)
    application = (
        db.query(Application)
        .join(Job, Application.job_id == Job.job_id)
        .filter(
            Application.application_id == id,
            Job.company_id == company.company_id,
        )
        .first()
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Application not found"
        )

    application.status = status_data.status
    db.commit()
    db.refresh(application)
    return application


@router.get("/profile", response_model=CompanyOut)
def get_company_profile(
    db: Session = Depends(get_db), current_user: User = Depends(require_company)
):
    """Get company profile details, auto-initializing shell if missing."""
    company = db.query(Company).filter(Company.user_id == current_user.id).first()
    if not company:
        company = Company(
            user_id=current_user.id,
            company_name="",
            hr_name=current_user.name,
            website="",
            location="Remote / Onsite",
            description="Official Hiring Partner",
        )
        db.add(company)
        db.commit()
        db.refresh(company)
    return company


@router.put("/profile", response_model=CompanyOut)
def create_or_update_company_profile(
    profile_data: CompanyProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company),
):
    """Create or update company profile."""
    company = db.query(Company).filter(Company.user_id == current_user.id).first()

    if not company:
        company_name = profile_data.company_name or ""
        hr_name = profile_data.hr_name or current_user.name
        company = Company(
            user_id=current_user.id,
            company_name=company_name,
            hr_name=hr_name,
            website=profile_data.website,
            location=profile_data.location,
            description=profile_data.description,
        )
        db.add(company)
    else:
        update_dict = profile_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            if value is not None:
                setattr(company, key, value)

    db.commit()
    db.refresh(company)
    return company
