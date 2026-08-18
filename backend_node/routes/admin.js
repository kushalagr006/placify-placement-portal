import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { CompanyProfile } from '../models/CompanyProfile.js';
import { AdminProfile } from '../models/AdminProfile.js';
import { Job } from '../models/Job.js';
import { Announcement } from '../models/Announcement.js';
import { College } from '../models/College.js';
import { Application } from '../models/Application.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['admin']));

async function getOrCreateAdminProfile(userId) {
  let profile = await AdminProfile.findOne({ user: userId }).populate('college');
  if (!profile) {
    profile = await AdminProfile.create({
      user: userId,
      designation: 'Head Placement Officer',
      department: 'Training & Placement Cell',
      phone: '',
      office: 'Main Building, TPO Block - Room 101',
    });
  }

  if (!profile.college) {
    const defaultCollege = await College.findOne({ status: 'Active' });
    if (defaultCollege) {
      profile.college = defaultCollege._id;
      await profile.save();
      profile = await profile.populate('college');
    }
  }

  return profile;
}

// GET /admin/profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await getOrCreateAdminProfile(req.user._id);
    res.json({
      admin_id: profile._id,
      user_id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      designation: profile.designation,
      department: profile.department,
      phone: profile.phone,
      office: profile.office,
      college: profile.college || null,
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

// PUT /admin/profile
router.put('/profile', async (req, res) => {
  try {
    let profile = await AdminProfile.findOne({ user: req.user._id });
    const { name, designation, department, phone, office, collegeId } = req.body;

    if (name && req.user) {
      await User.findByIdAndUpdate(req.user._id, { name });
      req.user.name = name;
    }

    if (!profile) {
      profile = await AdminProfile.create({
        user: req.user._id,
        designation: designation || 'Head Placement Officer',
        department: department || 'Training & Placement Cell',
        phone: phone || '',
        office: office || 'Main Building, TPO Block - Room 101',
        college: collegeId || undefined,
      });
    } else {
      if (designation !== undefined) profile.designation = designation;
      if (department !== undefined) profile.department = department;
      if (phone !== undefined) profile.phone = phone;
      if (office !== undefined) profile.office = office;
      if (collegeId !== undefined) profile.college = collegeId;
      await profile.save();
    }

    profile = await profile.populate('college');

    res.json({
      admin_id: profile._id,
      user_id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      designation: profile.designation,
      department: profile.department,
      phone: profile.phone,
      office: profile.office,
      college: profile.college || null,
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

// GET /admin/students
router.get('/students', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const filter = adminProfile.college ? { college: adminProfile.college._id } : {};

    const students = await StudentProfile.find(filter)
      .populate('user', 'name email role')
      .populate('college');

    const formatted = students.map((s) => ({
      student_id: s._id.toString(),
      user_id: s.user?._id ? s.user._id.toString() : null,
      branch: s.branch,
      semester: s.semester,
      cgpa: s.cgpa,
      skills: s.skills,
      phone: s.phone,
      resume: s.resume,
      verification_status: s.verification_status || 'Pending',
      college: s.college || null,
      user: s.user
        ? {
            id: s.user._id.toString(),
            name: s.user.name,
            email: s.user.email,
            role: s.user.role,
          }
        : null,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /admin/students/:id - Get complete student details for TPO Admin
router.get('/students/:id', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const adminCollegeIdStr = adminProfile.college?._id?.toString() || adminProfile.college?.toString();

    const targetId = req.params.id;
    let student = null;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      student = await StudentProfile.findOne({
        $or: [{ _id: targetId }, { user: targetId }],
      }).populate('user', 'name email role').populate('college');
    }

    if (!student) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    const studentCollegeIdStr = student.college?._id?.toString() || student.college?.toString();

    // Permission Guard: TPO Admin can only view students belonging to their college
    if (adminCollegeIdStr && studentCollegeIdStr && adminCollegeIdStr !== studentCollegeIdStr) {
      return res.status(403).json({ detail: 'Access Denied: You can only view detailed profiles of students enrolled at your college.' });
    }

    res.json({
      student_id: student._id,
      id: student._id,
      user_id: student.user?._id ? student.user._id.toString() : null,
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
      user: student.user
        ? {
            id: student.user._id.toString(),
            name: student.user.name,
            email: student.user.email,
            role: student.user.role,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /admin/students/:id/verify - Approve or Reject student registration
router.put('/students/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ detail: 'Invalid verification status' });
    }

    const adminProfile = await getOrCreateAdminProfile(req.user._id);

    const targetId = req.params.id;
    let student = null;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      student = await StudentProfile.findById(targetId);
      if (!student) {
        student = await StudentProfile.findOne({ user: targetId });
      }
    }

    if (!student) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    const getCollegeIdString = (ref) => {
      if (!ref) return null;
      if (ref._id) return ref._id.toString();
      return ref.toString();
    };

    const adminCollegeId = getCollegeIdString(adminProfile.college);

    // Auto-bind student to TPO Admin's college if admin has one
    if (adminCollegeId) {
      student.college = adminProfile.college._id || adminProfile.college;
    }

    student.verification_status = status;
    await student.save();

    const updated = await StudentProfile.findById(student._id)
      .populate('user', 'name email role')
      .populate('college');

    res.json({
      student_id: updated._id.toString(),
      user_id: updated.user?._id ? updated.user._id.toString() : null,
      branch: updated.branch,
      semester: updated.semester,
      cgpa: updated.cgpa,
      verification_status: updated.verification_status,
      college: updated.college || null,
      user: updated.user
        ? {
            id: updated.user._id.toString(),
            name: updated.user.name,
            email: updated.user.email,
            role: updated.user.role,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'Verification update failed' });
  }
});

// GET /admin/companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await CompanyProfile.find().populate('user', 'name email role');
    const formatted = companies.map((c) => ({
      company_id: c._id,
      user_id: c.user?._id,
      company_name: c.company_name,
      hr_name: c.hr_name,
      website: c.website,
      location: c.location,
      description: c.description,
      is_verified: c.is_verified,
      user: c.user
        ? {
            id: c.user._id,
            name: c.user.name,
            email: c.user.email,
            role: c.user.role,
          }
        : null,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /admin/jobs
router.get('/jobs', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const collegeId = adminProfile.college?._id || adminProfile.college;

    const filter = collegeId
      ? {
          $or: [
            { colleges: collegeId },
            { 'college_approvals.college': collegeId },
            { colleges: { $size: 0 } },
            { college: collegeId },
          ],
        }
      : {};

    const jobs = await Job.find(filter)
      .populate('company', 'company_name hr_name')
      .populate(['colleges', 'college_approvals.college']);

    const formatted = jobs.map((j) => {
      let tpoStatus = 'Approved'; // fallback if no specific college
      if (collegeId && Array.isArray(j.college_approvals)) {
        const appItem = j.college_approvals.find(
          (ca) => ca.college?._id?.toString() === collegeId.toString() || ca.college?.toString() === collegeId.toString()
        );
        if (appItem) tpoStatus = appItem.status;
      }

      return {
        job_id: j._id,
        id: j._id,
        title: j.title,
        description: j.description,
        package: j.package,
        location: j.location,
        eligibility: j.eligibility,
        deadline: j.deadline,
        status: j.status,
        tpo_status: tpoStatus,
        colleges: j.colleges || [],
        branches: j.branches || [],
        college_approvals: j.college_approvals || [],
        company: j.company?.company_name || 'Employer',
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /admin/jobs/:id/verify - TPO Approve or Reject job drive for their college
router.put('/jobs/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ detail: 'Invalid verification status' });
    }

    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const adminCollegeId = adminProfile.college?._id || adminProfile.college;

    if (!adminCollegeId) {
      return res.status(400).json({ detail: 'TPO Officer account is not assigned to any college' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ detail: 'Job drive not found' });
    }

    const getCollegeIdString = (col) => (col?._id ? col._id.toString() : col ? col.toString() : '');
    const adminCollegeStr = getCollegeIdString(adminCollegeId);

    // Check authorization: TPO's college must be targeted by this job drive
    const isTargeted =
      (Array.isArray(job.colleges) && job.colleges.some((c) => getCollegeIdString(c) === adminCollegeStr)) ||
      (Array.isArray(job.college_approvals) && job.college_approvals.some((ca) => getCollegeIdString(ca.college) === adminCollegeStr)) ||
      (job.college && getCollegeIdString(job.college) === adminCollegeStr);

    if (!isTargeted) {
      return res.status(403).json({ detail: 'Forbidden: You cannot review or verify job drives targeting another college' });
    }

    // Update approval item for admin's college
    if (!Array.isArray(job.college_approvals)) {
      job.college_approvals = [];
    }

    let existingApproval = job.college_approvals.find(
      (ca) => getCollegeIdString(ca.college) === adminCollegeStr
    );

    if (existingApproval) {
      existingApproval.status = status;
      existingApproval.reviewedAt = new Date();
    } else {
      job.college_approvals.push({
        college: adminCollegeId,
        status,
        reviewedAt: new Date(),
      });
    }

    if (job.college_approvals.some((ca) => ca.status === 'Approved')) {
      job.status = 'Active';
    } else if (job.college_approvals.every((ca) => ca.status === 'Rejected')) {
      job.status = 'Rejected by TPO';
    }

    await job.save();
    const updatedJob = await Job.findById(job._id).populate(['company', 'colleges', 'college_approvals.college']);

    res.json({
      message: `Job drive ${status.toLowerCase()} successfully for your college`,
      job_id: updatedJob._id,
      id: updatedJob._id,
      title: updatedJob.title,
      tpo_status: status,
      college_approvals: updatedJob.college_approvals || [],
    });
  } catch (err) {
    console.error('PUT /admin/jobs/:id/verify error:', err);
    res.status(500).json({ detail: err.message });
  }
});

// GET /admin/announcements
router.get('/announcements', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const filter = adminProfile.college ? { college: adminProfile.college._id } : {};

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

// POST /admin/announcements
router.post('/announcements', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ detail: 'Title and description are required' });
    }

    const adminProfile = await getOrCreateAdminProfile(req.user._id);

    const announcement = await Announcement.create({
      title,
      description,
      college: adminProfile.college?._id || adminProfile.college || null,
    });

    res.status(201).json({
      announcement_id: announcement._id,
      id: announcement._id,
      title: announcement.title,
      description: announcement.description,
      created_at: announcement.createdAt,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /admin/announcements/:id
router.delete('/announcements/:id', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);
    const filter = { _id: req.params.id };
    if (adminProfile.college) {
      filter.college = adminProfile.college._id;
    }

    await Announcement.deleteOne(filter);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /admin/applications - List student applications for TPO's college
router.get('/applications', async (req, res) => {
  try {
    const adminProfile = await getOrCreateAdminProfile(req.user._id);

    const getCollegeIdString = (ref) => {
      if (!ref) return null;
      if (ref._id) return ref._id.toString();
      return ref.toString();
    };

    const adminCollegeId = getCollegeIdString(adminProfile.college);

    let studentFilter = {};
    if (adminCollegeId) {
      studentFilter.college = adminCollegeId;
    }

    const tpoStudents = await StudentProfile.find(studentFilter).select('_id user branch cgpa college');
    const studentIds = tpoStudents.map((s) => s._id);

    const apps = await Application.find({ student: { $in: studentIds } })
      .populate({
        path: 'student',
        populate: [
          { path: 'user', select: 'name email role' },
          { path: 'college', select: 'name code' },
        ],
      })
      .populate({
        path: 'job',
        select: 'title package company status',
        populate: { path: 'company', select: 'company_name hr_name' },
      })
      .sort({ updatedAt: -1 });

    const formatted = apps.map((a) => {
      const s = a.student;
      const sId = s?._id ? s._id.toString() : null;
      const historyList = a.status_history || [];
      const rejectionHistory = [...historyList].reverse().find((h) => h.status === 'Rejected' && h.remarks);
      const lastHistory = [...historyList].reverse().find((h) => h.remarks && h.remarks.trim() !== '');

      return {
        application_id: a._id.toString(),
        id: a._id.toString(),
        job_id: a.job?._id ? a.job._id.toString() : null,
        student_id: sId,
        status: a.status,
        status_history: historyList,
        remarks: rejectionHistory?.remarks || lastHistory?.remarks || '',
        applied_at: a.createdAt,
        updated_at: a.updatedAt,
        studentName: s?.user?.name || 'Candidate',
        branch: s?.branch || 'N/A',
        cgpa: s?.cgpa || 'N/A',
        student: s
          ? {
              _id: sId,
              student_id: sId,
              id: sId,
              branch: s.branch || 'N/A',
              cgpa: s.cgpa || 'N/A',
              resume: s.resume || 'resume.pdf',
              user: s.user
                ? {
                    id: s.user._id ? s.user._id.toString() : null,
                    name: s.user.name,
                    email: s.user.email,
                  }
                : null,
            }
          : null,
        job: a.job
          ? {
              id: a.job._id.toString(),
              title: a.job.title,
              package: a.job.package,
              company_name: a.job.company?.company_name || 'Company',
            }
          : null,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /admin/applications/:id/verify - Approve or Reject candidate selection for TPO's college
router.put('/applications/:id/verify', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['Selected', 'Rejected'].includes(status)) {
      return res.status(400).json({ detail: 'Invalid status. Must be Selected or Rejected' });
    }

    const adminProfile = await getOrCreateAdminProfile(req.user._id);

    const getCollegeIdString = (ref) => {
      if (!ref) return null;
      if (ref._id) return ref._id.toString();
      return ref.toString();
    };

    const adminCollegeId = getCollegeIdString(adminProfile.college);

    const app = await Application.findById(req.params.id).populate('student');
    if (!app) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    // Verify candidate belongs to TPO's college
    const studentCollegeId = getCollegeIdString(app.student?.college);
    if (adminCollegeId && studentCollegeId && adminCollegeId !== studentCollegeId) {
      return res.status(403).json({ detail: 'Access denied: Candidate belongs to another college.' });
    }

    app.status = status;

    if (!Array.isArray(app.status_history)) {
      app.status_history = [];
    }

    app.status_history.push({
      status: status,
      updatedByRole: 'admin',
      updatedBy: req.user._id,
      remarks: remarks || (status === 'Selected' ? 'Candidate selection approved by TPO' : 'Candidate selection rejected by TPO'),
      timestamp: new Date(),
    });

    await app.save();

    res.json({
      application_id: app._id.toString(),
      id: app._id.toString(),
      status: app.status,
      status_history: app.status_history,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message || 'TPO selection review failed' });
  }
});

export default router;
