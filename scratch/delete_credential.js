import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../backend_node/models/User.js';
import { AdminProfile } from '../backend_node/models/AdminProfile.js';
import { StudentProfile } from '../backend_node/models/StudentProfile.js';
import { CompanyProfile } from '../backend_node/models/CompanyProfile.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal';

async function deleteUserCredential() {
  const targetEmail = 'ad@ssipmt.com';
  console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);

  await mongoose.connect(MONGODB_URI);

  const user = await User.findOne({ email: targetEmail.toLowerCase() });
  if (!user) {
    console.log(`❌ No user account found with email "${targetEmail}".`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Found user: ${user.name} (${user.email}), Role: ${user.role}, ID: ${user._id}`);

  // Delete associated profiles
  const adminDel = await AdminProfile.deleteMany({ user: user._id });
  const studentDel = await StudentProfile.deleteMany({ user: user._id });
  const companyDel = await CompanyProfile.deleteMany({ user: user._id });
  const userDel = await User.deleteOne({ _id: user._id });

  console.log(`✅ Successfully deleted user credential "${targetEmail}":`);
  console.log(`   - Deleted ${userDel.deletedCount} User record`);
  console.log(`   - Deleted ${adminDel.deletedCount} AdminProfile record(s)`);
  console.log(`   - Deleted ${studentDel.deletedCount} StudentProfile record(s)`);
  console.log(`   - Deleted ${companyDel.deletedCount} CompanyProfile record(s)`);

  await mongoose.disconnect();
}

deleteUserCredential().catch((err) => {
  console.error('Error during deletion:', err);
  process.exit(1);
});
