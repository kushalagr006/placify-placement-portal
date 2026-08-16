import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRouter from './routes/auth.js';
import studentRouter from './routes/student.js';
import companyRouter from './routes/company.js';
import adminRouter from './routes/admin.js';

import { College } from './models/College.js';
import { User } from './models/User.js';
import { StudentProfile } from './models/StudentProfile.js';
import { CompanyProfile } from './models/CompanyProfile.js';
import { AdminProfile } from './models/AdminProfile.js';
import { Job } from './models/Job.js';
import { Announcement } from './models/Announcement.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable universal CORS so any frontend port (3000, 4000, etc.) accesses the backend
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Serve static uploaded files (e.g. PDF resumes at http://127.0.0.1:5000/uploads/resumes/...)
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Mount API Routers
app.use('/auth', authRouter);
app.use('/student', studentRouter);
app.use('/company', companyRouter);
app.use('/admin', adminRouter);

// Option 2: Pure API Backend Root Endpoint (returns JSON API status)
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to MERN Placement & Internship Portal Backend (MongoDB + Express + Node.js)',
    endpoints: {
      auth: '/auth/login | /auth/signup | /auth/me',
      student: '/student/jobs | /student/applications | /student/profile | /student/announcements',
      company: '/company/jobs | /company/applications | /company/profile',
      admin: '/admin/students | /admin/companies | /admin/jobs | /admin/announcements | /admin/profile',
    },
  });
});

const defaultColleges = [
  { name: 'SSIPMT Raipur C.G', code: 'SSIPMT', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'CSVTU Bhilai C.G', code: 'CSVTU', location: 'Bhilai, C.G.', status: 'Active' },
  { name: 'Amity University Raipur', code: 'AMITY', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'BIT DURG', code: 'BIT', location: 'Durg, C.G.', status: 'Active' },
  { name: 'MAIC Raipur', code: 'MAIC', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'SSPU Bhilai', code: 'SSPU', location: 'Bhilai, C.G.', status: 'Active' },
];

async function ensureCollegesExist() {
  const map = {};
  for (const c of defaultColleges) {
    let college = await College.findOne({ code: c.code });
    if (!college) {
      // Also check by name if code matches legacy
      college = await College.findOne({ name: c.name });
    }
    if (!college) {
      college = await College.create(c);
    }
    map[c.code] = college;
  }
  return map;
}

// Automatic Seed Function: Pre-populates default demo accounts ONLY IF database is empty
async function seedInitialData() {
  try {
    const collegesMap = await ensureCollegesExist();
    const college1 = collegesMap['SSIPMT'];
    const college2 = collegesMap['CSVTU'];

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Seeding default demo accounts into MongoDB...');

      // 1. Create Default Recruiter User & Company Profile (Shared / Cross-college employer)
      const recruiterPassword = await bcrypt.hash('recruiter123', 10);
      const companyUser = await User.create({
        name: 'Alex Johnson',
        email: 'recruiter@vtportal.com',
        password: recruiterPassword,
        role: 'company',
      });
      const companyProfile = await CompanyProfile.create({
        user: companyUser._id,
        company_name: 'TechCorp Solutions',
        hr_name: 'Alex Johnson',
        website: 'https://www.techcorp.com',
        location: 'Raipur / Remote',
        description: 'Leading Global Cloud & AI Solutions Provider',
        is_verified: true,
      });

      // Create Job Posting assigned to SSIPMT Raipur
      await Job.create({
        company: companyProfile._id,
        college: college1._id,
        title: 'Full Stack Software Engineer',
        description: 'Looking for talented Full Stack MERN Developers to build scalable web applications.',
        package: '12 - 16 LPA',
        location: 'Raipur / Hybrid',
        eligibility: 'Min 7.5 CGPA',
        deadline: '2026-12-31',
        status: 'Active',
      });

      // 2. COLLEGE 1 DATA (SSIPMT Raipur C.G)
      // Student Profile
      const student1Password = await bcrypt.hash('student123', 10);
      const student1User = await User.create({
        name: 'Kushan Student',
        email: 'student@vtportal.com',
        password: student1Password,
        role: 'student',
      });
      await StudentProfile.create({
        user: student1User._id,
        college: college1._id,
        branch: 'Computer Science',
        semester: 8,
        cgpa: 8.9,
        skills: 'React, Node.js, Express, MongoDB, JavaScript',
        phone: '+91 9876543210',
        resume: 'Resume.pdf',
        verification_status: 'Approved',
      });

      // Admin Profile
      const admin1Password = await bcrypt.hash('admin123', 10);
      const admin1User = await User.create({
        name: 'Dr. V. K. Raman',
        email: 'admin@vtportal.com',
        password: admin1Password,
        role: 'admin',
      });
      await AdminProfile.create({
        user: admin1User._id,
        college: college1._id,
        designation: 'Head Placement Officer (TPO)',
        department: 'Training & Placement Cell',
        phone: '+91 9876500000',
        office: 'SSIPMT Block A - Room 101',
      });

      // Announcement
      await Announcement.create({
        title: 'SSIPMT Campus Recruitment Drive 2026 Kickoff',
        description: 'Welcome students! SSIPMT Raipur placement drives for 2026 batch have officially commenced.',
        college: college1._id,
      });

      // 3. COLLEGE 2 DATA (CSVTU Bhilai C.G)
      // Student Profile
      const student2Password = await bcrypt.hash('student123', 10);
      const student2User = await User.create({
        name: 'Rahul Verma',
        email: 'csvtu_student@vtportal.com',
        password: student2Password,
        role: 'student',
      });
      await StudentProfile.create({
        user: student2User._id,
        college: college2._id,
        branch: 'Information Technology',
        semester: 8,
        cgpa: 8.2,
        skills: 'Python, Django, AWS, SQL',
        phone: '+91 9811122233',
        resume: 'Resume.pdf',
        verification_status: 'Approved',
      });

      // Admin Profile
      const admin2Password = await bcrypt.hash('admin123', 10);
      const admin2User = await User.create({
        name: 'Prof. S. K. Sharma',
        email: 'csvtu_admin@vtportal.com',
        password: admin2Password,
        role: 'admin',
      });
      await AdminProfile.create({
        user: admin2User._id,
        college: college2._id,
        designation: 'Chief Placement Officer (CSVTU)',
        department: 'Training & Placement Division',
        phone: '+91 9811100000',
        office: 'CSVTU Admin Block - Room 204',
      });

      // Announcement
      await Announcement.create({
        title: 'CSVTU Placement Drive Notice',
        description: 'Important update for CSVTU students regarding upcoming recruitment rounds.',
        college: college2._id,
      });

      console.log('✅ Default demo colleges and multi-tenant accounts successfully seeded into MongoDB!');
    } else {
      console.log(`🔒 Persistent MongoDB contains ${userCount} registered user accounts. Ensured all 6 colleges are active.`);
    }
  } catch (err) {
    console.error('⚠️ Error checking initial seed data:', err.message);
  }
}

// Connect to Persistent MongoDB Database before launching HTTP server
async function startServer() {
  const localUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';

  try {
    console.log(`Connecting to MongoDB at ${localUri}...`);
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log('==========================================================');
    console.log('✅ Connected to MongoDB Database server successfully!');
    console.log('==========================================================');
  } catch (err) {
    console.log('==========================================================');
    console.log('⚠️  Local MongoDB service not running on localhost:27017');
    console.log('💾 Initializing Persistent Disk Storage MongoDB Engine...');
    console.log('==========================================================');
    
    const persistentDbPath = path.join(process.cwd(), 'data', 'db');
    if (!fs.existsSync(persistentDbPath)) {
      fs.mkdirSync(persistentDbPath, { recursive: true });
    } else {
      const lockFile = path.join(persistentDbPath, 'mongod.lock');
      if (fs.existsSync(lockFile)) {
        try { fs.unlinkSync(lockFile); } catch {}
      }
    }

    try {
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: persistentDbPath,
          storageEngine: 'wiredTiger',
        },
      });
      await mongoose.connect(mongod.getUri());
      console.log('✅ Connected to Persistent MongoDB Database on disk successfully!');
      console.log(`💾 Database Files Location: ${persistentDbPath}`);
    } catch (persistentErr) {
      console.log(`⚠️ Database engine notice: ${persistentErr.message}`);
      const fallbackMongod = await MongoMemoryServer.create();
      await mongoose.connect(fallbackMongod.getUri());
      console.log('✅ Connected to MongoDB Database successfully!');
    }
  }

  // Ensure initial data is seeded ONLY if DB is empty
  await seedInitialData();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MERN Stack Backend Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer();
