-- ==========================================
-- Placement Portal PostgreSQL Schema Setup
-- Database Name: placement_portal
-- ==========================================

-- Step 1: Drop existing tables if re-initialising (in order of dependencies)
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing ENUM types if re-initialising
DROP TYPE IF EXISTS app_status CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Step 2: Custom ENUM Types
CREATE TYPE user_role AS ENUM ('Student', 'Company', 'Admin');
CREATE TYPE app_status AS ENUM ('Applied', 'Shortlisted', 'Selected', 'Rejected');
CREATE TYPE job_status AS ENUM ('Active', 'Closed');

-- Step 3: Users Table (Central authentication for all users)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed password
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Students Table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    branch VARCHAR(100) NOT NULL,
    semester INT CHECK (semester BETWEEN 1 AND 8),
    cgpa NUMERIC(4, 2) CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    skills TEXT[], -- PostgreSQL Array type e.g. ARRAY['React', 'Node.js', 'PostgreSQL']
    resume VARCHAR(255), -- Resume file path or URL
    phone VARCHAR(15),
    CONSTRAINT fk_student_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 5: Companies Table
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    hr_name VARCHAR(100),
    website VARCHAR(255),
    location VARCHAR(100),
    description TEXT,
    CONSTRAINT fk_company_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 6: Jobs Table
CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    package VARCHAR(50), -- e.g. '12 LPA'
    location VARCHAR(100),
    eligibility TEXT, -- e.g. 'Min 7.5 CGPA, CSE/IT only'
    deadline DATE NOT NULL,
    status job_status DEFAULT 'Active',
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- Step 7: Applications Table
CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    job_id INT NOT NULL,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status app_status DEFAULT 'Applied',
    CONSTRAINT fk_app_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    CONSTRAINT unique_student_job UNIQUE (student_id, job_id) -- Prevents duplicate applications
);

-- Step 8: Announcements Table
CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_by INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Step 9: Performance Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_job ON applications(job_id);
