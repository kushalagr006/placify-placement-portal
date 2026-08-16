import mongoose from 'mongoose';

async function checkRemaining() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log('\n--- REMAINING USERS ---');
  const users = await db.collection('users').find({}).toArray();
  users.forEach(u => console.log(`${u._id} | ${u.role} | ${u.name} <${u.email}>`));

  console.log('\n--- REMAINING STUDENT PROFILES ---');
  const students = await db.collection('studentprofiles').aggregate([
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
    { $lookup: { from: 'colleges', localField: 'college', foreignField: '_id', as: 'c' } }
  ]).toArray();
  students.forEach(s => console.log(`${s._id} | User: ${s.u[0]?.name} <${s.u[0]?.email}> | College: ${s.c[0]?.name || 'Unassigned'} | Branch: ${s.branch} | Sem: ${s.semester} | CGPA: ${s.cgpa} | Status: ${s.verification_status}`));

  console.log('\n--- REMAINING ADMIN PROFILES ---');
  const admins = await db.collection('adminprofiles').aggregate([
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
    { $lookup: { from: 'colleges', localField: 'college', foreignField: '_id', as: 'c' } }
  ]).toArray();
  admins.forEach(a => console.log(`${a._id} | User: ${a.u[0]?.name} <${a.u[0]?.email}> | College: ${a.c[0]?.name || 'Unassigned'} | Desig: ${a.designation}`));

  console.log('\n--- REMAINING COMPANY PROFILES ---');
  const companies = await db.collection('companyprofiles').aggregate([
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } }
  ]).toArray();
  companies.forEach(c => console.log(`${c._id} | User: ${c.u[0]?.name} <${c.u[0]?.email}> | Company: ${c.company_name}`));

  console.log('\n--- REMAINING JOBS ---');
  const jobs = await db.collection('jobs').find({}).toArray();
  jobs.forEach(j => console.log(`${j._id} | Title: "${j.title}" | Status: ${j.status}`));

  await mongoose.disconnect();
}

checkRemaining().catch(console.error);
