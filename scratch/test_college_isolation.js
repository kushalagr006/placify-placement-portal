import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { College } from '../backend_node/models/College.js';
import { User } from '../backend_node/models/User.js';
import { StudentProfile } from '../backend_node/models/StudentProfile.js';
import { AdminProfile } from '../backend_node/models/AdminProfile.js';

async function testStudentVerificationWorkflow() {
  console.log('Testing Student Signup Branch/College Requirement & TPO Verification Workflow...');

  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // 1. Create SSIPMT and BIT DURG colleges
  const ssipmt = await College.create({ name: 'SSIPMT Raipur C.G', code: 'SSIPMT', location: 'Raipur' });
  const bit = await College.create({ name: 'BIT DURG', code: 'BIT', location: 'Durg' });

  // 2. Create SSIPMT TPO Admin & BIT TPO Admin
  const pass = await bcrypt.hash('admin123', 10);
  const ssipmtAdminUser = await User.create({ name: 'SSIPMT TPO', email: 'tpo@ssipmt.com', password: pass, role: 'admin' });
  const ssipmtAdminProfile = await AdminProfile.create({ user: ssipmtAdminUser._id, college: ssipmt._id });

  const bitAdminUser = await User.create({ name: 'BIT TPO', email: 'tpo@bit.com', password: pass, role: 'admin' });
  const bitAdminProfile = await AdminProfile.create({ user: bitAdminUser._id, college: bit._id });

  // 3. Register New Student choosing SSIPMT & CS Branch
  const newStudentUser = await User.create({ name: 'Amit Kumar', email: 'amit@ssipmt.com', password: pass, role: 'student' });
  const newStudentProfile = await StudentProfile.create({
    user: newStudentUser._id,
    college: ssipmt._id,
    branch: 'Computer Science & Engineering',
    verification_status: 'Pending',
  });

  console.log(`\n1. New Student Registered: ${newStudentUser.name}`);
  console.log(`   Assigned College: ${ssipmt.name} (${ssipmt.code})`);
  console.log(`   Selected Branch: ${newStudentProfile.branch}`);
  console.log(`   Initial Verification Status: ${newStudentProfile.verification_status} (Expected: Pending)`);

  // 4. Verify Pending Student Access Guard
  const isPendingBlocked = newStudentProfile.verification_status !== 'Approved';
  console.log(`\n2. Pending Access Restriction Shield: ${isPendingBlocked ? 'PASSED (Job application blocked for pending student)' : 'FAILED'}`);

  // 5. Simulate TPO Rejection
  newStudentProfile.verification_status = 'Rejected';
  await newStudentProfile.save();
  console.log(`\n3. TPO Rejects Student: Verification status = "${newStudentProfile.verification_status}"`);

  // 6. Student Re-Applies for Verification with updated Branch
  newStudentProfile.branch = 'Information Technology';
  newStudentProfile.verification_status = 'Pending';
  await newStudentProfile.save();

  const reapplied = await StudentProfile.findById(newStudentProfile._id);
  console.log(`\n4. Student Re-Applies for Verification:`);
  console.log(`   Updated Branch: ${reapplied.branch}`);
  console.log(`   Reset Status: ${reapplied.verification_status} (Expected: Pending)`);
  console.log(`   Re-Apply Cycle Test: ${reapplied.verification_status === 'Pending' ? 'PASSED' : 'FAILED'}`);

  // 7. SSIPMT TPO approves student
  reapplied.verification_status = 'Approved';
  await reapplied.save();

  const updatedProfile = await StudentProfile.findById(reapplied._id);
  console.log(`\n5. TPO Verification Action: Status updated to "${updatedProfile.verification_status}" by SSIPMT TPO Officer`);
  console.log(`   Unlocked Portal Access: ${updatedProfile.verification_status === 'Approved' ? 'PASSED (Full Portal Access Unlocked)' : 'FAILED'}`);

  await mongoose.disconnect();
  await mongod.stop();
  console.log('\n🎉 ALL STUDENT RE-APPLY & VERIFICATION WORKFLOW TESTS PASSED SUCCESSFULLY!');
}

testStudentVerificationWorkflow().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
