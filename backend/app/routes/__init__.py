from app.routes.auth import router as auth_router
from app.routes.student import router as student_router
from app.routes.company import router as company_router
from app.routes.admin import router as admin_router

__all__ = ["auth_router", "student_router", "company_router", "admin_router"]
