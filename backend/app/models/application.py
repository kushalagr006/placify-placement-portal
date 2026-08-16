from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(
        Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False
    )
    job_id = Column(
        Integer, ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False
    )
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(
        String(20), default="Applied"
    )  # Applied, Shortlisted, Selected, Rejected

    # Relationships
    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")

    __table_args__ = (
        UniqueConstraint("student_id", "job_id", name="unique_student_job_application"),
    )
