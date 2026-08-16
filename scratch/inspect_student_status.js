import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';
import fs from 'fs';
import { User } from '../backend_node/models/User.js';
import { StudentProfile } from '../backend_node/models/StudentProfile.js';
import { College } from '../backend_node/models/College.js';

async function setStudentCollege() {
  const persistentDbPath = path.join(process.cwd(), 'data', 'db');
  const lockFile = path.join(persistentDbPath, 'mongod.lock');
  if (fs.existsSync(lockFile)) {
    try { fs.unlinkSync(lockFile); } catch {}
  }

  const mongod = await MongoMemoryServer.create({
    instance: { dbPath: persistentDbPath, storageEngine: 'wiredTiger' },
  });
  await mongoose.connect(mongod.getUri());

  const ssipmt = await College.findOne({ code: 'SSIPMT' });
  const user = await User.findOne({ email: 'student@vtportal.com' });
  const student = await StudentProfile.findOne({ user: user._id });

  if (ssipmt && student) {
    student.college = ssipmt._id;
    student.branch = 'Computer Science & Engineering';
    student.verification_status = 'Approved';
    await student.save();
    console.log(`✅ Set student@vtportal.com college to ${ssipmt.name} (${ssipmt.code}), Branch: ${student.branch}, Status: Approved`);
  }

  await mongoose.disconnect();
  await mongod.stop();
}

setStudentCollege();
