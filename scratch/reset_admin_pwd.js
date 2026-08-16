import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function resetPasswords() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);
  const recruiterPassword = await bcrypt.hash('recruiter123', 10);

  await db.collection('users').updateMany({ role: 'admin' }, { $set: { password: adminPassword } });
  await db.collection('users').updateMany({ role: 'student' }, { $set: { password: studentPassword } });
  await db.collection('users').updateMany({ role: 'company' }, { $set: { password: recruiterPassword } });

  console.log('✅ Passwords reset for remaining real accounts:');
  console.log('   Admins: admin123');
  console.log('   Students: student123');
  console.log('   Recruiters: recruiter123');

  await mongoose.disconnect();
}

resetPasswords().catch(console.error);
