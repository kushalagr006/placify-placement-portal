import mongoose from 'mongoose';

const collegeApprovalSchema = new mongoose.Schema({
  college: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedAt: { type: Date },
});

const jobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
    title: { type: String, required: true },
    description: { type: String, default: 'Campus Hiring Drive' },
    package: { type: String, default: 'Competitive' },
    location: { type: String, default: 'Remote / Onsite' },
    eligibility: { type: String, default: 'Min 7.0 CGPA' },
    deadline: { type: String, default: '2026-12-31' },
    status: { type: String, default: 'Active' },
    colleges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'College' }],
    branches: [{ type: String }],
    college_approvals: [collegeApprovalSchema],
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
