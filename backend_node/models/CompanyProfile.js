import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    company_name: { type: String, default: '' },
    hr_name: { type: String, default: '' },
    website: { type: String, default: '' },
    location: { type: String, default: 'Remote / Onsite' },
    description: { type: String, default: 'Official Campus Hiring Partner' },
    is_verified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
