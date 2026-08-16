import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Pending TPO Approval', 'Pending TPO Selection Approval', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    status_history: [
      {
        status: { type: String, required: true },
        updatedByRole: { type: String, enum: ['student', 'company', 'admin'] },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        remarks: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
