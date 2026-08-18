import mongoose from 'mongoose';

async function listAllUsers() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const users = await db.collection('users').find({}).toArray();
  console.log(`=== ALL USERS (${users.length}) ===`);
  users.forEach((u, i) => {
    console.log(`${i+1}. Name: "${u.name}", Email: "${u.email}", Role: "${u.role}", ID: ${u._id}`);
  });

  const students = await db.collection('studentprofiles').aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    }
  ]).toArray();

  console.log(`\n=== ALL STUDENT PROFILES (${students.length}) ===`);
  students.forEach((s, i) => {
    const user = s.userInfo[0];
    console.log(`${i+1}. Student ID: ${s._id}, User: ${user?.name} <${user?.email}>, Status: ${s.verification_status}, Branch: ${s.branch}, Sem: ${s.semester}, CGPA: ${s.cgpa}`);
  });

  await mongoose.disconnect();
}

listAllUsers().catch(console.error);
