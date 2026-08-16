import mongoose from 'mongoose';

async function fullAnalyze() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const collections = ['users', 'studentprofiles', 'adminprofiles', 'companyprofiles', 'jobs', 'applications', 'announcements', 'colleges'];

  for (const colName of collections) {
    const docs = await db.collection(colName).find({}).toArray();
    console.log(`\n=================== ${colName.toUpperCase()} (${docs.length} docs) ===================`);
    docs.forEach((doc, idx) => {
      console.log(`[${idx+1}] ID: ${doc._id}`);
      if (colName === 'users') console.log(`    Name: "${doc.name}" | Email: "${doc.email}" | Role: "${doc.role}"`);
      if (colName === 'studentprofiles') console.log(`    User: ${doc.user} | Branch: ${doc.branch} | Status: ${doc.verification_status} | College: ${doc.college}`);
      if (colName === 'adminprofiles') console.log(`    User: ${doc.user} | Desig: ${doc.designation} | College: ${doc.college}`);
      if (colName === 'companyprofiles') console.log(`    User: ${doc.user} | Company: ${doc.company_name}`);
      if (colName === 'jobs') console.log(`    Title: "${doc.title}" | Company: ${doc.company} | Status: ${doc.status}`);
      if (colName === 'applications') console.log(`    Student: ${doc.student} | Job: ${doc.job} | Status: ${doc.status}`);
      if (colName === 'announcements') console.log(`    Title: "${doc.title}" | College: ${doc.college}`);
      if (colName === 'colleges') console.log(`    Code: ${doc.code} | Name: ${doc.name}`);
    });
  }

  await mongoose.disconnect();
}

fullAnalyze().catch(console.error);
