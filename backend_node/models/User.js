import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['student', 'company', 'admin'], 
      required: true 
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
