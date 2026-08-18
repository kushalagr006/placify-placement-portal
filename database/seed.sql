-- ==========================================
-- Placement Portal Sample Seed Data
-- ==========================================

-- 1. Insert Users (Admin, Company, Students)
INSERT INTO users (name, email, password, role) VALUES
('TPO Admin', 'admin@college.edu', '$2b$10$hashedpassword_admin', 'Admin'),
('TechCorp HR', 'hr@techcorp.com', '$2b$10$hashedpassword_company', 'Company'),
('InnovateLab HR', 'recruiter@innovatelab.io', '$2b$10$hashedpassword_company', 'Company'),
('Rahul Sharma', 'rahul.cse@college.edu', '$2b$10$hashedpassword_student', 'Student'),
('Priya Patel', 'priya.ece@college.edu', '$2b$10$hashedpassword_student', 'Student');

-- 2. Insert Students
INSERT INTO students (user_id, branch, semester, cgpa, skills, resume, phone) VALUES
(4, 'Computer Science', 8, 8.75, ARRAY['Java', 'React', 'PostgreSQL', 'DSA'], 'https://storage.college.edu/resumes/rahul.pdf', '9876543210'),
(5, 'Electronics & Comm.', 8, 9.10, ARRAY['Python', 'C++', 'Embedded Systems'], 'https://storage.college.edu/resumes/priya.pdf', '9876543211');

-- 3. Insert Companies
INSERT INTO companies (user_id, company_name, hr_name, website, location, description) VALUES
(2, 'TechCorp Solutions', 'Anita Roy', 'https://techcorp.com', 'Bengaluru, India', 'Leading Enterprise Software and Cloud Solutions Provider.'),
(3, 'InnovateLab AI', 'Vikram Malhotra', 'https://innovatelab.io', 'Gurugram, India', 'AI & Machine Learning Product Startup.');

-- 4. Insert Jobs
INSERT INTO jobs (company_id, title, description, package, location, eligibility, deadline, status) VALUES
(1, 'Software Development Engineer (SDE-1)', 'Develop and maintain full stack web applications using React & Node.js.', '12 LPA', 'Bengaluru', 'CSE/IT branch with CGPA >= 7.5', '2026-08-15', 'Active'),
(2, 'AI/ML Engineering Intern', 'Work on Large Language Models and data processing pipelines.', '15 LPA', 'Gurugram', 'Open to all branches with CGPA >= 8.0', '2026-08-20', 'Active');

-- 5. Insert Applications
INSERT INTO applications (student_id, job_id, status) VALUES
(1, 1, 'Shortlisted'),
(1, 2, 'Applied'),
(2, 2, 'Selected');

-- 6. Insert Announcements
INSERT INTO announcements (title, description, created_by) VALUES
('Campus Drive 2026 Starting', 'TechCorp Solutions and InnovateLab AI will conduct placement drives next month.', 1),
('Resume Submission Deadline', 'All final year students must update their verified resume by 10th August.', 1);
