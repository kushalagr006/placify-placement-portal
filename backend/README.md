# College Placement & Internship Portal - FastAPI Backend

A production-structured, beginner-friendly FastAPI backend with MySQL, SQLAlchemy ORM, Alembic migrations, Pydantic validation, and JWT Authentication.

---

## Folder Structure

```
backend/
├── app/
│   ├── main.py              # Application entrypoint & CORS configuration
│   ├── database.py          # SQLAlchemy engine, session maker & get_db dependency
│   ├── config.py            # Environment settings (Pydantic BaseSettings)
│   ├── security.py          # Password hashing (bcrypt), JWT creation & role checks
│   │
│   ├── models/              # SQLAlchemy ORM database models
│   │   ├── user.py          # Users table (student, company, admin roles)
│   │   ├── student.py       # Students table
│   │   ├── company.py       # Companies table
│   │   ├── job.py           # Jobs table
│   │   ├── application.py   # Applications table
│   │   └── announcement.py  # Announcements table
│   │
│   ├── schemas/             # Pydantic request/response validation schemas
│   │   ├── user.py
│   │   ├── student.py
│   │   ├── company.py
│   │   ├── job.py
│   │   ├── application.py
│   │   └── announcement.py
│   │
│   ├── routes/              # FastAPI Router endpoints
│   │   ├── auth.py          # /auth/signup & /auth/login
│   │   ├── student.py       # /student/jobs, /student/applications, /student/profile
│   │   ├── company.py       # /company/jobs, /company/applications, /company/profile
│   │   └── admin.py         # /admin/students, /admin/companies, /admin/announcements
│   │
│   ├── services/            # Extra business logic (if needed)
│   └── utils/               # Utility functions
│
├── alembic/                 # Database migration scripts
├── tests/                   # Automated tests
├── requirements.txt         # Project dependencies
├── .env.example             # Sample environment variables
├── Dockerfile               # Container setup
└── alembic.ini              # Alembic migration settings
```

---

## Getting Started

### 1. Setup Virtual Environment & Install Dependencies
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update your MySQL connection details:
```bash
cp .env.example .env
```
Example `.env`:
```ini
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/placement_db
SECRET_KEY=your-super-secret-jwt-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 3. Run Database Migrations (Alembic)
```bash
# Create initial migration
alembic revision --autogenerate -m "Initial schema setup"

# Apply migration to MySQL database
alembic upgrade head
```

### 4. Start Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open interactive Swagger API Documentation at:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## API Summary

### Authentication APIs
- `POST /auth/signup` - Register a new User (`student`, `company`, or `admin`)
- `POST /auth/login` - Authenticate and get JWT token

### Student APIs (Role: `student`)
- `GET /student/jobs` - View all active job postings
- `POST /student/jobs/{id}/apply` - Apply for a job
- `GET /student/applications` - View submitted applications
- `GET /student/profile` - View student profile
- `PUT /student/profile` - Create/Update student profile

### Company APIs (Role: `company`)
- `POST /company/jobs` - Post a new job
- `GET /company/jobs` - List posted jobs
- `PUT /company/jobs/{id}` - Update a job
- `DELETE /company/jobs/{id}` - Delete a job
- `GET /company/jobs/{id}/applications` - View applications for a job
- `PUT /company/applications/{id}/status` - Update application status (`Applied`, `Shortlisted`, `Selected`, `Rejected`)
- `GET /company/profile` - View company profile
- `PUT /company/profile` - Create/Update company profile

### Admin APIs (Role: `admin`)
- `GET /admin/students` - View all student profiles
- `GET /admin/companies` - View all company profiles
- `GET /admin/jobs` - View all job postings
- `POST /admin/announcements` - Create a new announcement
- `GET /admin/announcements` - List all announcements
- `DELETE /admin/announcements/{id}` - Delete an announcement
