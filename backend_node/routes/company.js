import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { CompanyProfile } from '../models/CompanyProfile.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { College } from '../models/College.js';
import { StudentProfile } from '../models/StudentProfile.js';

const router = express.Router();
router.use(authenticateToken, requireRole(['company']));

async function getOrCreateCompanyProfile(userId, userName) {
  let company = await CompanyProfile.findOne({ user: userId });
  if (!company) {
    company = await CompanyProfile.create({
      user: userId,
      company_name: '',
      hr_name: userName,
      website: '',
      location: 'Remote / Onsite',
      description: 'Official Hiring Partner',
    });
  }
  return company;
}

async function resolveCollegeIds(collegesInput) {
  if (!Array.isArray(collegesInput) || collegesInput.length === 0) {
    return [];
  }
  const resolvedIds = [];
  for (const c of collegesInput) {
    if (mongoose.Types.ObjectId.isValid(c)) {
      resolvedIds.push(c);
    } else {
      const found = await College.findOne({ $or: [{ code: c }, { name: c }] });
      if (found) resolvedIds.push(found._id);
    }
  }
  return resolvedIds;
}

function getOverallJobStatus(job) {
  if (!job.college_approvals || job.college_approvals.length === 0) {
    return job.status || 'Pending TPO Approval';
  }
  const statuses = job.college_approvals.map((ca) => ca.status);
  if (statuses.includes('Approved')) {
    return 'Active';
  }
  if (statuses.every((s) => s === 'Rejected')) {
    return 'Rejected by TPO';
  }
  return 'Pending TPO Approval';
}

// POST /company/jobs
router.post('/jobs', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    const { title, description, package: pkg, location, eligibility, deadline, colleges, branches } = req.body;

    let targetCollegeIds = await resolveCollegeIds(colleges);
    if (targetCollegeIds.length === 0) {
      const allColleges = await College.find({ status: 'Active' });
      targetCollegeIds = allColleges.map((c) => c._id);
    }

    const collegeApprovals = targetCollegeIds.map((cId) => ({
      college: cId,
      status: 'Pending',
    }));

    const resolvedBranches = Array.isArray(branches) ? branches.map(b => b.trim()).filter(Boolean) : [];

    let job = await Job.create({
      company: company._id,
      title,
      description: description || 'Campus Hiring Drive',
      package: pkg || 'Competitive',
      location: location || 'Remote / Onsite',
      eligibility: eligibility || 'Min 7.0 CGPA',
      deadline: deadline || '2026-12-31',
      status: 'Pending TPO Approval',
      colleges: targetCollegeIds,
      branches: resolvedBranches,
      college_approvals: collegeApprovals,
    });

    job = await job.populate(['colleges', 'college_approvals.college']);

    res.status(201).json({
      job_id: job._id,
      id: job._id,
      company_id: company._id,
      title: job.title,
      description: job.description,
      package: job.package,
      location: job.location,
      eligibility: job.eligibility,
      deadline: job.deadline,
      status: getOverallJobStatus(job),
      colleges: job.colleges || [],
      branches: job.branches || [],
      college_approvals: job.college_approvals || [],
      company: company.company_name || 'Employer',
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /company/jobs
router.get('/jobs', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    const jobs = await Job.find({ company: company._id }).populate(['colleges', 'college_approvals.college']);

    const formatted = jobs.map((j) => ({
      job_id: j._id,
      id: j._id,
      company_id: company._id,
      title: j.title,
      description: j.description,
      package: j.package,
      location: j.location,
      eligibility: j.eligibility,
      deadline: j.deadline,
      status: getOverallJobStatus(j),
      colleges: j.colleges || [],
      branches: j.branches || [],
      college_approvals: j.college_approvals || [],
      company: company.company_name || 'Employer',
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /company/jobs/:id
router.put('/jobs/:id', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    const job = await Job.findOne({ _id: req.params.id, company: company._id });

    if (!job) {
      return res.status(404).json({ detail: 'Job posting not found' });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({
      job_id: job._id,
      id: job._id,
      title: job.title,
      description: job.description,
      package: job.package,
      location: job.location,
      eligibility: job.eligibility,
      deadline: job.deadline,
      status: job.status,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /company/jobs/:id
router.delete('/jobs/:id', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    await Job.deleteOne({ _id: req.params.id, company: company._id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /company/applications
router.get('/applications', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    let companyJobs = await Job.find({ company: company._id }).select('_id');
    if (companyJobs.length === 0) {
      companyJobs = await Job.find({ company: req.user._id }).select('_id');
    }
    const jobIds = companyJobs.map((j) => j._id);

    const rawApps = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title package')
      .lean();

    const formatted = await Promise.all(
      rawApps.map(async (a) => {
        let studentProfile = null;
        if (a.student) {
          studentProfile = await StudentProfile.findOne({
            $or: [{ _id: a.student }, { user: a.student }],
          }).populate('user', 'name email role');
        }

        const studentIdStr = studentProfile
          ? studentProfile._id.toString()
          : a.student
          ? a.student.toString()
          : null;

        const studentName = studentProfile?.user?.name || 'Candidate';
        const email = studentProfile?.user?.email || '';

        const historyList = a.status_history || [];
        const rejectionHistory = [...historyList].reverse().find((h) => h.status === 'Rejected' && h.remarks);
        const lastHistory = [...historyList].reverse().find((h) => h.remarks && h.remarks.trim() !== '');

        return {
          application_id: a._id.toString(),
          id: a._id.toString(),
          job_id: a.job?._id ? a.job._id.toString() : (a.job ? a.job.toString() : null),
          student_id: studentIdStr,
          status: a.status,
          status_history: historyList,
          remarks: rejectionHistory?.remarks || lastHistory?.remarks || '',
          applied_at: a.createdAt,
          studentName: studentName,
          branch: studentProfile?.branch || 'N/A',
          cgpa: studentProfile?.cgpa || 'N/A',
          student: {
            _id: studentIdStr,
            student_id: studentIdStr,
            id: studentIdStr,
            branch: studentProfile?.branch || 'N/A',
            cgpa: studentProfile?.cgpa || 'N/A',
            resume: studentProfile?.resume || 'resume.pdf',
            user: {
              id: studentProfile?.user?._id ? studentProfile.user._id.toString() : null,
              name: studentName,
              email: email,
            },
          },
          job: {
            id: a.job?._id ? a.job._id.toString() : null,
            title: a.job?.title || 'Job Posting',
            package: a.job?.package || 'Competitive',
          },
        };
      })
    );

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PUT /company/applications/:id/status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    // Workflow: If company accepts or shortlists candidate, status transitions to Pending TPO Approval
    let targetStatus = status;
    if (['Selected', 'Accepted', 'Shortlisted'].includes(status)) {
      targetStatus = 'Pending TPO Approval';
    }

    app.status = targetStatus;

    if (!Array.isArray(app.status_history)) {
      app.status_history = [];
    }

    app.status_history.push({
      status: targetStatus,
      updatedByRole: 'company',
      updatedBy: req.user._id,
      remarks: remarks || (targetStatus === 'Rejected' ? 'Application rejected by Recruiter' : 'Company candidate selection submitted for TPO Approval'),
      timestamp: new Date(),
    });

    await app.save();

    res.json({
      application_id: app._id,
      id: app._id,
      status: app.status,
      status_history: app.status_history,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /company/profile
router.get('/profile', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);
    res.json({
      company_id: company._id,
      user_id: req.user._id,
      company_name: company.company_name,
      hr_name: company.hr_name || req.user.name,
      website: company.website,
      location: company.location,
      description: company.description,
      is_verified: company.is_verified,
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

// PUT /company/profile
router.put('/profile', async (req, res) => {
  try {
    let company = await CompanyProfile.findOne({ user: req.user._id });
    const { company_name, hr_name, website, location, description } = req.body;

    if (!company) {
      company = await CompanyProfile.create({
        user: req.user._id,
        company_name: company_name || '',
        hr_name: hr_name || req.user.name,
        website: website || '',
        location: location || 'Remote / Onsite',
        description: description || 'Official Hiring Partner',
      });
    } else {
      if (company_name !== undefined) company.company_name = company_name;
      if (hr_name !== undefined) company.hr_name = hr_name;
      if (website !== undefined) company.website = website;
      if (location !== undefined) company.location = location;
      if (description !== undefined) company.description = description;
      await company.save();
    }

    res.json({
      company_id: company._id,
      user_id: req.user._id,
      company_name: company.company_name,
      hr_name: company.hr_name,
      website: company.website,
      location: company.location,
      description: company.description,
      is_verified: company.is_verified,
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

// GET /company/students/:id - Get complete student details for Recruiter if student applied to company job
router.get('/students/:id', async (req, res) => {
  try {
    const company = await getOrCreateCompanyProfile(req.user._id, req.user.name);

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

    // Permission Guard: Check if student applied to any job posted by this company
    let companyJobs = await Job.find({ company: company._id }).select('_id');
    if (companyJobs.length === 0) {
      companyJobs = await Job.find({ company: req.user._id }).select('_id');
    }
    const companyJobIds = companyJobs.map(j => j._id);

    const studentUser = student.user?._id || student.user;

    const hasApplied = await Application.findOne({
      $or: [
        { student: student._id },
        { student: studentUser },
      ],
      job: { $in: companyJobIds },
    });

    if (!hasApplied) {
      return res.status(403).json({ detail: 'Access Denied: You can only view complete profiles of candidates who have applied to your job drives.' });
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

export default router;
