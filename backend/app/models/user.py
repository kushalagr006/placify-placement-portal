from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # student, company, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship(
        "Student", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    company = relationship(
        "Company", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    announcements = relationship("Announcement", back_populates="creator")
