from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    company_id = Column(
        Integer, ForeignKey("companies.company_id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    package = Column(String(50), nullable=True)
    location = Column(String(100), nullable=True)
    eligibility = Column(Text, nullable=True)
    deadline = Column(Date, nullable=False)
    status = Column(String(20), default="Active")  # Active, Closed

    # Relationships
    company = relationship("Company", back_populates="jobs")
    applications = relationship(
        "Application", back_populates="job", cascade="all, delete-orphan"
    )
