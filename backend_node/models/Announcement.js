import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    college: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
