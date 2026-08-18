import mongoose from 'mongoose';

const externalLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Hackathon', 'Certification', 'Award', 'Competition', 'Other'],
    default: 'Other',
  },
  description: { type: String, default: '' },
  date: { type: String, default: '' },
  issuer: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: { type: String, default: '' },
  github_link: { type: String, default: '' },
  live_link: { type: String, default: '' },
});

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    branch: { type: String, default: 'Computer Science' },
    semester: { type: Number, default: 8, min: 1, max: 8 },
    cgpa: { type: Number, default: 8.5, min: 0.0, max: 10.0 },
    skills: { type: String, default: 'React, JavaScript, SQL' },
    phone: { type: String, default: '' },
    resume: { type: String, default: 'Resume.pdf' },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
    verification_status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    external_links: [externalLinkSchema],
    achievements: [achievementSchema],
    projects: [projectSchema],
  },
  { timestamps: true }
);

export const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
