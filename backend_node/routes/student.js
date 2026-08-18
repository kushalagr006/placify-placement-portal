import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { uploadResumeMiddleware } from '../middleware/upload.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Announcement } from '../models/Announcement.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['student']));

// POST /student/resume/upload - Handle PDF Resume File Upload
router.post('/resume/upload', (req, res) => {
  uploadResumeMiddleware.single('resume')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ detail: err.message || 'PDF upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ detail: 'No PDF file selected for upload' });
    }

    try {
      const filename = req.file.filename;
      const fileUrl = `/uploads/resumes/${filename}`;

      let student = await StudentProfile.findOne({ user: req.user._id });
      if (!student) {
        student = await StudentProfile.create({
          user: req.user._id,
          resume: filename,
        });
      } else {
        student.resume = filename;
        await student.save();
      }

      res.json({
        message: 'PDF Resume uploaded successfully',
        filename,
        url: fileUrl,
        student,
      });
    } catch (dbErr) {
      res.status(500).json({ detail: dbErr.message || 'Database update failed' });
    }
  });
});

// GET /student/announcements - Fetch broadcasted TPO announcements
router.get('/announcements', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student || student.verification_status !== 'Approved') {
      return res.json([]);
    }

    const filter = student.college ? { college: student.college } : {};

    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    const formatted = announcements.map((a) => ({
      announcement_id: a._id,
      id: a._id,
      title: a.title,
      description: a.description,
      created_at: a.createdAt,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /student/jobs
router.get('/jobs', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student || student.verification_status !== 'Approved') {
      return res.json([]);
    }

    const studentCollegeId = student.college?._id || student.college;

    const filter = {
      status: 'Active',
    };

    const conditions = [];

    if (studentCollegeId) {
      conditions.push({
        $or: [
          { college_approvals: { $elemMatch: { college: studentCollegeId, status: 'Approved' } } },
          { $and: [{ colleges: { $size: 0 } }, { college_approvals: { $size: 0 } }] },
        ],
      });
    }

    if (student.branch) {
      conditions.push({
        $or: [
          { branches: { $size: 0 } },
          { branches: student.branch },
          { branches: { $exists: false } },
        ],
      });
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    const jobs = await Job.find(filter)
      .populate(['colleges', 'college_approvals.college'])
      .populate({
        path: 'company',
        select: 'company_name hr_name location',
      });

    console.log('GET /student/jobs filter:', JSON.stringify(filter), 'Student college:', student.college, 'Found jobs:', jobs.map(j => ({ id: j._id, title: j.title, approvals: j.college_approvals })));

    const formatted = jobs.map((j) => ({
      job_id: j._id,
      id: j._id,
      title: j.title,
      description: j.description,
      package: j.package,
      location: j.location,
      eligibility: j.eligibility,
      deadline: j.deadline,
      status: j.status,
      colleges: j.colleges || [],
      branches: j.branches || [],
      company: j.company?.company_name || 'Employer',
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /student/jobs/:id/apply
router.post('/jobs/:id/apply', async (req, res) => {
  try {
    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      student = await StudentProfile.create({ user: req.user._id });
    }

    if (student.verification_status !== 'Approved') {
      return res.status(403).json({
        detail: 'Your student account is pending approval by your college TPO. You cannot apply for jobs until approved.',
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ detail: 'Job posting not found' });
    }
    if (job.status !== 'Active') {
      return res.status(400).json({ detail: 'This job posting is no longer active' });
    }

    const existingApp = await Application.findOne({ student: student._id, job: job._id });
    if (existingApp) {
      return res.status(400).json({ detail: 'You have already applied for this job' });
    }

    const app = await Application.create({
      student: student._id,
      job: job._id,
      status: 'Applied',
    });

    res.status(201).json({
      application_id: app._id,
      id: app._id,
      student_id: student._id,
      job_id: job._id,
      status: app.status,
      applied_at: app.createdAt,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /student/applications
router.get('/applications', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student || student.verification_status !== 'Approved') return res.json([]);

    const apps = await Application.find({ student: student._id }).populate({
      path: 'job',
      populate: { path: 'company', select: 'company_name' },
    });

    const formatted = apps.map((a) => {
      const historyList = a.status_history || [];
      const rejectionHistory = [...historyList].reverse().find((h) => h.status === 'Rejected' && h.remarks);
      const lastHistory = [...historyList].reverse().find((h) => h.remarks && h.remarks.trim() !== '');

      return {
        application_id: a._id,
        id: a._id,
        student_id: student._id,
        job_id: a.job?._id,
        status: a.status,
        status_history: historyList,
        remarks: rejectionHistory?.remarks || lastHistory?.remarks || '',
        applied_at: a.createdAt,
        job: a.job
          ? {
              title: a.job.title,
              package: a.job.package,
              company: a.job.company?.company_name || 'Employer',
            }
          : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

function normalizeUrl(str) {
  if (!str || typeof str !== 'string' || !str.trim()) return '';
  let trimmed = str.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string' || !urlString.trim()) return false;
  const normalized = normalizeUrl(urlString);
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// GET /student/profile
router.get('/profile', async (req, res) => {
  try {
    let student = await StudentProfile.findOne({ user: req.user._id })
      .populate('user', 'name email role')
      .populate('college');

    if (!student) {
      student = await StudentProfile.create({ user: req.user._id });
      student = await student.populate(['user', 'college']);
    }

    res.json({
      student_id: student._id,
      user_id: req.user._id,
      branch: student.branch,
      semester: student.semester,
      cgpa: student.cgpa,
      skills: student.skills,
      phone: student.phone,
      resume: student.resume,
      verification_status: student.verification_status || 'Pending',
      college: student.college || null,
      external_links: student.external_links || [],
      achievements: student.achievements || [],
      projects: student.projects || [],
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /student/profile
router.put('/profile', async (req, res) => {
  try {
    let student = await StudentProfile.findOne({ user: req.user._id });
    const { branch, semester, cgpa, skills, phone, resume, collegeId, external_links, achievements, projects } = req.body;

    if (!student) {
      student = await StudentProfile.create({
        user: req.user._id,
        branch: branch || 'Computer Science',
        semester: semester || 8,
        cgpa: cgpa !== undefined ? cgpa : 8.5,
        skills: skills || 'React, JavaScript, SQL',
        phone: phone || '',
        resume: resume || 'Resume.pdf',
        college: collegeId || undefined,
        verification_status: 'Pending',
        external_links: external_links || [],
        achievements: achievements || [],
        projects: projects || [],
      });
    } else {
      if (branch !== undefined) student.branch = branch;
      if (semester !== undefined) student.semester = semester;
      if (cgpa !== undefined) student.cgpa = cgpa;
      if (skills !== undefined) student.skills = skills;
      if (phone !== undefined) student.phone = phone;
      if (resume !== undefined) student.resume = resume;
      if (collegeId !== undefined) student.college = collegeId;
      if (external_links !== undefined) student.external_links = external_links;
      if (achievements !== undefined) student.achievements = achievements;
      if (projects !== undefined) student.projects = projects;
      await student.save();
    }

    student = await student.populate('college');

    res.json({
      student_id: student._id,
      user_id: req.user._id,
      branch: student.branch,
      semester: student.semester,
      cgpa: student.cgpa,
      skills: student.skills,
      phone: student.phone,
      resume: student.resume,
      verification_status: student.verification_status || 'Pending',
      college: student.college || null,
      external_links: student.external_links || [],
      achievements: student.achievements || [],
      projects: student.projects || [],
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// --- EXTERNAL LINKS CRUD ---
// POST /student/links
router.post('/links', async (req, res) => {
  try {
    const { title, url } = req.body;
    if (!title || !url) return res.status(400).json({ detail: 'Title and URL are required' });
    
    const normalized = normalizeUrl(url);
    if (!isValidUrl(normalized)) return res.status(400).json({ detail: 'Invalid website URL format' });

    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) student = await StudentProfile.create({ user: req.user._id });

    student.external_links.push({ title, url: normalized });
    await student.save();
    res.status(201).json(student.external_links);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /student/links/:linkId
router.put('/links/:linkId', async (req, res) => {
  try {
    const { title, url } = req.body;
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    const item = student.external_links.id(req.params.linkId);
    if (!item) return res.status(404).json({ detail: 'External link not found' });

    if (title) item.title = title;
    if (url) {
      const normalized = normalizeUrl(url);
      if (!isValidUrl(normalized)) return res.status(400).json({ detail: 'Invalid website URL format' });
      item.url = normalized;
    }

    await student.save();
    res.json(student.external_links);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /student/links/:linkId
router.delete('/links/:linkId', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    student.external_links.pull(req.params.linkId);
    await student.save();
    res.json(student.external_links);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// --- ACHIEVEMENTS CRUD ---
// POST /student/achievements
router.post('/achievements', async (req, res) => {
  try {
    const { title, category, description, date, issuer } = req.body;
    if (!title) return res.status(400).json({ detail: 'Achievement title is required' });

    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) student = await StudentProfile.create({ user: req.user._id });

    student.achievements.push({
      title,
      category: category || 'Other',
      description: description || '',
      date: date || '',
      issuer: issuer || '',
    });

    await student.save();
    res.status(201).json(student.achievements);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /student/achievements/:achievementId
router.put('/achievements/:achievementId', async (req, res) => {
  try {
    const { title, category, description, date, issuer } = req.body;
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    const item = student.achievements.id(req.params.achievementId);
    if (!item) return res.status(404).json({ detail: 'Achievement entry not found' });

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (date !== undefined) item.date = date;
    if (issuer !== undefined) item.issuer = issuer;

    await student.save();
    res.json(student.achievements);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /student/achievements/:achievementId
router.delete('/achievements/:achievementId', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    student.achievements.pull(req.params.achievementId);
    await student.save();
    res.json(student.achievements);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// --- PROJECTS CRUD ---
// POST /student/projects
router.post('/projects', async (req, res) => {
  try {
    const { name, description, technologies, github_link, live_link } = req.body;
    if (!name) return res.status(400).json({ detail: 'Project name is required' });

    const normalizedGithub = github_link ? normalizeUrl(github_link) : '';
    const normalizedLive = live_link ? normalizeUrl(live_link) : '';

    if (github_link && !isValidUrl(normalizedGithub)) {
      return res.status(400).json({ detail: 'Invalid GitHub URL format' });
    }
    if (live_link && !isValidUrl(normalizedLive)) {
      return res.status(400).json({ detail: 'Invalid Live Demo URL format' });
    }

    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) student = await StudentProfile.create({ user: req.user._id });

    student.projects.push({
      name,
      description: description || '',
      technologies: technologies || '',
      github_link: normalizedGithub,
      live_link: normalizedLive,
    });

    await student.save();
    res.status(201).json(student.projects);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /student/projects/:projectId
router.put('/projects/:projectId', async (req, res) => {
  try {
    const { name, description, technologies, github_link, live_link } = req.body;

    const normalizedGithub = github_link ? normalizeUrl(github_link) : undefined;
    const normalizedLive = live_link ? normalizeUrl(live_link) : undefined;

    if (github_link && !isValidUrl(normalizedGithub)) {
      return res.status(400).json({ detail: 'Invalid GitHub URL format' });
    }
    if (live_link && !isValidUrl(normalizedLive)) {
      return res.status(400).json({ detail: 'Invalid Live Demo URL format' });
    }

    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    const item = student.projects.id(req.params.projectId);
    if (!item) return res.status(404).json({ detail: 'Project entry not found' });

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (technologies !== undefined) item.technologies = technologies;
    if (normalizedGithub !== undefined) item.github_link = normalizedGithub;
    if (normalizedLive !== undefined) item.live_link = normalizedLive;

    await student.save();
    res.json(student.projects);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /student/projects/:projectId
router.delete('/projects/:projectId', async (req, res) => {
  try {
    const student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ detail: 'Student profile not found' });

    student.projects.pull(req.params.projectId);
    await student.save();
    res.json(student.projects);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /student/reapply-verification - Re-apply for verification after rejection
router.post('/reapply-verification', async (req, res) => {
  try {
    const { collegeId, branch } = req.body;
    let student = await StudentProfile.findOne({ user: req.user._id });
    if (!student) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    if (collegeId) {
      if (mongoose.Types.ObjectId.isValid(collegeId)) {
        student.college = collegeId;
      } else {
        const found = await College.findOne({ $or: [{ code: collegeId }, { name: collegeId }] });
        if (found) student.college = found._id;
      }
    }
    if (branch) student.branch = branch;

    student.verification_status = 'Pending';
    await student.save();

    student = await student.populate(['user', 'college']);

    res.json({
      student_id: student._id,
      user_id: req.user._id,
      branch: student.branch,
      semester: student.semester,
      cgpa: student.cgpa,
      skills: student.skills,
      phone: student.phone,
      resume: student.resume,
      verification_status: student.verification_status,
      college: student.college || null,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
