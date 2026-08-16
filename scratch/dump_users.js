import mongoose from 'mongoose';

async function dump() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  console.log(`TOTAL USERS: ${users.length}`);
  users.forEach((u, i) => {
    console.log(`[${i+1}] ID:${u._id} | Role:${u.role.padEnd(8)} | Email:${u.email} | Name:${u.name}`);
  });

  await mongoose.disconnect();
}

dump().catch(console.error);
