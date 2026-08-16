import mongoose from 'mongoose';

async function performCleanup() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  console.log(`Connecting to MongoDB at ${uri}...`);
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Identify mock users to delete
  const allUsers = await db.collection('users').find({}).toArray();
  const mockUserIds = [];
  const realUserIds = [];

  for (const user of allUsers) {
    const isMock = 
      /1786\d+/.test(user.email) ||
      /1786\d+/.test(user.name) ||
      user.email.startsWith('targeted_student') ||
      user.email.startsWith('ssipmt_student') ||
      user.email.startsWith('portfolio_student') ||
      user.email.startsWith('ssipmt_app') ||
      user.email.startsWith('csvtu_student_1') ||
      user.email.startsWith('cand_a') ||
      user.email.startsWith('cand_b') ||
      user.email.startsWith('student_1') ||
      user.email.startsWith('recruiter_1') ||
      user.email.startsWith('ssipmt_tpo_1') ||
      user.email.startsWith('csvtu_tpo_1') ||
      user.email.startsWith('urltest');

    if (isMock) {
      mockUserIds.push(user._id);
    } else {
      realUserIds.push(user._id);
    }
  }

  console.log(`Found ${mockUserIds.length} mock user accounts to remove out of ${allUsers.length} total users.`);
  console.log(`Keeping ${realUserIds.length} real user accounts.`);

  // 2. Remove mock Users
  const userDeleteRes = await db.collection('users').deleteMany({ _id: { $in: mockUserIds } });
  console.log(`Deleted ${userDeleteRes.deletedCount} users.`);

  // 3. Remove StudentProfiles referencing mock users or with mock status
  const studentDeleteRes = await db.collection('studentprofiles').deleteMany({
    $or: [
      { user: { $in: mockUserIds } },
      { user: { $nin: realUserIds } }
    ]
  });
  console.log(`Deleted ${studentDeleteRes.deletedCount} student profiles.`);

  // 4. Remove AdminProfiles referencing mock users
  const adminDeleteRes = await db.collection('adminprofiles').deleteMany({
    $or: [
      { user: { $in: mockUserIds } },
      { user: { $nin: realUserIds } }
    ]
  });
  console.log(`Deleted ${adminDeleteRes.deletedCount} admin profiles.`);

  // 5. Remove CompanyProfiles referencing mock users
  const companyDeleteRes = await db.collection('companyprofiles').deleteMany({
    $or: [
      { user: { $in: mockUserIds } },
      { user: { $nin: realUserIds } }
    ]
  });
  console.log(`Deleted ${companyDeleteRes.deletedCount} company profiles.`);

  // 6. Identify remaining valid student profile IDs and company profile IDs
  const validStudentProfiles = await db.collection('studentprofiles').find({}).toArray();
  const validStudentProfileIds = validStudentProfiles.map(s => s._id);

  const validCompanyProfiles = await db.collection('companyprofiles').find({}).toArray();
  const validCompanyProfileIds = validCompanyProfiles.map(c => c._id);

  // 7. Remove mock / test Jobs
  const jobDeleteRes = await db.collection('jobs').deleteMany({
    $or: [
      { company: { $nin: validCompanyProfileIds } },
      { title: { $regex: /1786\d+/ } },
      { title: 'Senior Software Developer (Targeted)' },
      { title: 'Full Stack Engineer (TPO Approval Test)' },
      { title: 'Student Profile Access Test Job' },
      { title: 'Recruiter Status Display Test Drive' },
      { title: 'Frontend Developer Drive' },
      { title: 'Backend Engineer Drive' }
    ]
  });
  console.log(`Deleted ${jobDeleteRes.deletedCount} mock/test job drives.`);

  const validJobs = await db.collection('jobs').find({}).toArray();
  const validJobIds = validJobs.map(j => j._id);

  // 8. Remove Applications referencing non-existent students or non-existent jobs or mock candidates
  const appDeleteRes = await db.collection('applications').deleteMany({
    $or: [
      { student: { $nin: validStudentProfileIds } },
      { job: { $nin: validJobIds } }
    ]
  });
  console.log(`Deleted ${appDeleteRes.deletedCount} invalid/test applications.`);

  console.log('\n================ CLEANUP SUMMARY ================');
  console.log(`Remaining Users: ${await db.collection('users').countDocuments()}`);
  console.log(`Remaining Student Profiles: ${await db.collection('studentprofiles').countDocuments()}`);
  console.log(`Remaining Admin Profiles: ${await db.collection('adminprofiles').countDocuments()}`);
  console.log(`Remaining Company Profiles: ${await db.collection('companyprofiles').countDocuments()}`);
  console.log(`Remaining Jobs: ${await db.collection('jobs').countDocuments()}`);
  console.log(`Remaining Applications: ${await db.collection('applications').countDocuments()}`);

  console.log('\n--- Remaining Real Students ---');
  const remainingStudents = await db.collection('studentprofiles').aggregate([
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } }
  ]).toArray();
  remainingStudents.forEach((s, idx) => {
    const user = s.u[0];
    console.log(`[${idx+1}] ${user?.name} <${user?.email}> | Branch: ${s.branch} | Sem: ${s.semester} | CGPA: ${s.cgpa} | Status: ${s.verification_status}`);
  });

  await mongoose.disconnect();
}

performCleanup().catch(console.error);
