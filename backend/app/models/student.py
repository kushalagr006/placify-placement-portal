from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    branch = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False)
    cgpa = Column(Float, nullable=False)
    skills = Column(Text, nullable=True)
    phone = Column(String(15), nullable=True)
    resume = Column(String(255), nullable=True)

    # Relationships
    user = relationship("User", back_populates="student")
    applications = relationship(
        "Application", back_populates="student", cascade="all, delete-orphan"
    )
