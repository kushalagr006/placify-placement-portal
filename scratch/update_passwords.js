import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function updatePasswords() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const newPasswordHash = await bcrypt.hash('kushal1234', 10);

  const targets = ['stucse@ssipmt.com', 'ad@ssipmt.com'];

  const res = await db.collection('users').updateMany(
    { email: { $in: targets } },
    { $set: { password: newPasswordHash } }
  );

  console.log(`Updated passwords for ${res.modifiedCount} accounts (${targets.join(', ')}).`);

  await mongoose.disconnect();
}

updatePasswords().catch(console.error);
