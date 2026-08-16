import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { College } from '../models/College.js';
import { User } from '../models/User.js';
import { AdminProfile } from '../models/AdminProfile.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { CompanyProfile } from '../models/CompanyProfile.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

const DEFAULT_COLLEGES = [
  { name: 'SSIPMT Raipur C.G', code: 'SSIPMT', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'CSVTU Bhilai C.G', code: 'CSVTU', location: 'Bhilai, C.G.', status: 'Active' },
  { name: 'Amity University Raipur', code: 'AMITY', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'BIT DURG', code: 'BIT', location: 'Durg, C.G.', status: 'Active' },
  { name: 'MAIC Raipur', code: 'MAIC', location: 'Raipur, C.G.', status: 'Active' },
  { name: 'SSPU Bhilai', code: 'SSPU', location: 'Bhilai, C.G.', status: 'Active' },
];

async function fetchOrSeedColleges() {
  let colleges = await College.find({ status: 'Active' }).sort({ name: 1 });
  if (!colleges || colleges.length === 0) {
    for (const c of DEFAULT_COLLEGES) {
      let existing = await College.findOne({ code: c.code });
      if (!existing) {
        await College.create(c);
      }
    }
    colleges = await College.find({ status: 'Active' }).sort({ name: 1 });
  }
  return colleges;
}

// GET /auth/colleges - Public list of active colleges for signup selection
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await fetchOrSeedColleges();
    res.json(
      colleges.map((c) => ({
        id: c._id,
        _id: c._id,
        name: c.name,
        code: c.code,
        location: c.location,
      }))
    );
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Error fetching colleges' });
  }
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, collegeId, branch } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ detail: 'Name, email, password, and role are required' });
    }

    if (role === 'admin' && !collegeId) {
      return res.status(400).json({ detail: 'Please select a college for TPO Admin registration' });
    }

    if (role === 'student' && (!collegeId || !branch)) {
      return res.status(400).json({ detail: 'Please select both your College and Branch for student registration' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ detail: 'Email address is already registered' });
    }

    // Resolve target college ID if passed as ObjectId or code/name
    let targetCollegeId = undefined;
    if (collegeId) {
      if (mongoose.Types.ObjectId.isValid(collegeId)) {
        targetCollegeId = collegeId;
      } else {
        const found = await College.findOne({
          $or: [{ code: collegeId }, { name: collegeId }],
        });
        if (found) targetCollegeId = found._id;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    // Auto-create role profile linked to selected college
    if (role === 'admin') {
      await AdminProfile.create({
        user: user._id,
        college: targetCollegeId,
        designation: 'Head Placement Officer (TPO)',
        department: 'Training & Placement Cell',
      });
    } else if (role === 'student') {
      await StudentProfile.create({
        user: user._id,
        college: targetCollegeId,
        branch: branch || 'Computer Science',
        verification_status: 'Pending',
      });
    }

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: targetCollegeId || null,
      created_at: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Server error during signup' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });
    if (!user) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    const access_token = jwt.sign(
      { sub: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      access_token,
      token_type: 'bearer',
      role: user.role,
      user_id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Server error during login' });
  }
});

// GET /auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    created_at: req.user.createdAt,
  });
});

// DELETE /auth/purge/:email - Purge user credential and profiles by email
router.delete('/purge/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ detail: `No account found with email "${email}"` });
    }

    await AdminProfile.deleteMany({ user: user._id });
    await StudentProfile.deleteMany({ user: user._id });
    await CompanyProfile.deleteMany({ user: user._id });
    await User.deleteOne({ _id: user._id });

    res.json({ message: `Successfully deleted user account ${email}` });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Server error during deletion' });
  }
});

// DELETE /auth/account - Self-service account deletion endpoint
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    if (role === 'student') {
      const student = await StudentProfile.findOne({ user: userId });
      if (student) {
        await Application.deleteMany({ student: student._id });
        await StudentProfile.deleteOne({ _id: student._id });
      }
    } else if (role === 'admin') {
      await AdminProfile.deleteMany({ user: userId });
    } else if (role === 'company') {
      const company = await CompanyProfile.findOne({ user: userId });
      if (company) {
        await Job.deleteMany({ company: company._id });
        await CompanyProfile.deleteOne({ _id: company._id });
      }
    }

    await User.deleteOne({ _id: userId });

    res.json({ message: 'Account and profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Error deleting account' });
  }
});

export default router;
