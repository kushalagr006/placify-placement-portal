from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Attempt MySQL connection first; fallback to SQLite if MySQL service is not running locally
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=False,
    )
    # Quick connectivity check
    with engine.connect() as conn:
        print(f"Connected to database: {settings.DATABASE_URL.split('@')[-1]}")
except Exception:
    print("==========================================================================")
    print("Warning: MySQL connection failed on localhost.")
    print("Falling back to zero-config SQLite local database (placement.db)")
    print("To use MySQL, make sure MySQL service is running and update your .env")
    print("==========================================================================")
    engine = create_engine(
        "sqlite:///./placement.db",
        connect_args={"check_same_thread": False},
        echo=False,
    )

# Session factory for DB operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()


def get_db():
    """Dependency function yielding a database session per HTTP request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
