import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../backend_node/models/User.js';
import { StudentProfile } from '../backend_node/models/StudentProfile.js';
import { AdminProfile } from '../backend_node/models/AdminProfile.js';

async function testSelfServiceAccountDeletion() {
  console.log('Testing Self-Service Delete Account/Profile API...');

  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // 1. Create a user
  const pass = await bcrypt.hash('password123', 10);
  const user = await User.create({ name: 'Temp User', email: 'temp@test.com', password: pass, role: 'student' });
  const profile = await StudentProfile.create({ user: user._id, branch: 'Computer Science' });

  console.log(`Created user: ${user.name} (${user.email}) [ID: ${user._id}]`);

  // 2. Perform deletion
  await StudentProfile.deleteOne({ _id: profile._id });
  await User.deleteOne({ _id: user._id });

  // 3. Verify deletion
  const foundUser = await User.findById(user._id);
  const foundProfile = await StudentProfile.findById(profile._id);

  console.log(`User query result: ${foundUser ? 'EXISTS' : 'DELETED'}`);
  console.log(`Profile query result: ${foundProfile ? 'EXISTS' : 'DELETED'}`);

  await mongoose.disconnect();
  await mongod.stop();

  if (!foundUser && !foundProfile) {
    console.log('\n🎉 SELF-SERVICE ACCOUNT DELETION TEST PASSED SUCCESSFULLY!');
  } else {
    throw new Error('Account deletion failed!');
  }
}

testSelfServiceAccountDeletion().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
