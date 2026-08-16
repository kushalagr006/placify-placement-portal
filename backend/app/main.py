from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routes import auth_router, student_router, company_router, admin_router

# Create database tables automatically if they don't exist yet
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for College Placement & Internship Portal with MySQL, SQLAlchemy & JWT Auth.",
)

# Enable CORS for React Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(student_router)
app.include_router(company_router)
app.include_router(admin_router)


@app.get("/", tags=["Health Check"])
def root():
    """Root health check endpoint."""
    return {
        "status": "online",
        "message": "Welcome to College Placement & Internship Portal API",
        "docs": "/docs",
    }
