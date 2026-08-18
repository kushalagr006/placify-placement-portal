import mongoose from 'mongoose';

const adminProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    designation: { type: String, default: 'Head Placement Officer' },
    department: { type: String, default: 'Training & Placement Cell' },
    phone: { type: String, default: '' },
    office: { type: String, default: 'Main Building, TPO Block - Room 101' },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  },
  { timestamps: true }
);

export const AdminProfile = mongoose.model('AdminProfile', adminProfileSchema);
