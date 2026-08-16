from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    company_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    company_name = Column(String(150), nullable=False)
    hr_name = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    location = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="company")
    jobs = relationship(
        "Job", back_populates="company", cascade="all, delete-orphan"
    )
