import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { User } from '../backend_node/models/User.js';
import { AdminProfile } from '../backend_node/models/AdminProfile.js';
import { StudentProfile } from '../backend_node/models/StudentProfile.js';
import { CompanyProfile } from '../backend_node/models/CompanyProfile.js';

async function deleteCredentialFromDiskDb() {
  const targetEmail = 'ad@ssipmt.com';
  const persistentDbPath = path.join(process.cwd(), 'data', 'db');
  console.log(`Connecting to Persistent Disk Database at: ${persistentDbPath}...`);

  const lockFile = path.join(persistentDbPath, 'mongod.lock');
  if (fs.existsSync(lockFile)) {
    try { fs.unlinkSync(lockFile); } catch {}
  }

  let mongod;
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        dbPath: persistentDbPath,
        storageEngine: 'wiredTiger',
      },
    });
    await mongoose.connect(mongod.getUri());
    console.log('✅ Connected to backend disk DB.');
  } catch (err) {
    console.log(`Fallback connecting to localhost or in-memory DB: ${err.message}`);
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  }

  // 1. Find user by email (case-insensitive)
  const users = await User.find({
    $or: [
      { email: targetEmail.toLowerCase() },
      { email: { $regex: new RegExp(`^${targetEmail}$`, 'i') } },
      { email: { $regex: /ad@ssipmt/i } },
    ],
  });

  if (users.length === 0) {
    console.log(`❌ No matching user found for email filter "ad@ssipmt". Listing all registered users in disk DB:`);
    const allUsers = await User.find({}, 'name email role');
    allUsers.forEach((u) => {
      console.log(`   - ${u.name} (${u.email}) [Role: ${u.role}]`);
    });
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
    return;
  }

  for (const user of users) {
    console.log(`Found User: ${user.name} (${user.email}), Role: ${user.role}, ID: ${user._id}`);

    const adminDel = await AdminProfile.deleteMany({ user: user._id });
    const studentDel = await StudentProfile.deleteMany({ user: user._id });
    const companyDel = await CompanyProfile.deleteMany({ user: user._id });
    const userDel = await User.deleteOne({ _id: user._id });

    console.log(`✅ Successfully DELETED user "${user.email}":`);
    console.log(`   - User record deleted: ${userDel.deletedCount}`);
    console.log(`   - AdminProfile deleted: ${adminDel.deletedCount}`);
    console.log(`   - StudentProfile deleted: ${studentDel.deletedCount}`);
    console.log(`   - CompanyProfile deleted: ${companyDel.deletedCount}`);
  }

  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

deleteCredentialFromDiskDb().catch((err) => {
  console.error('Error during deletion:', err);
  process.exit(1);
});
