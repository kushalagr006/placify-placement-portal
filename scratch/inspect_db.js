import mongoose from 'mongoose';

async function inspect() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  console.log(`Connecting to ${uri}...`);
  await mongoose.connect(uri);

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`\n--- Collection: ${col.name} (${count} docs) ---`);
    const docs = await db.collection(col.name).find({}).limit(50).toArray();
    docs.forEach((doc, idx) => {
      console.log(`[${idx+1}] ID: ${doc._id}`);
      if (doc.email) console.log(`   Email: ${doc.email}, Name: ${doc.name}, Role: ${doc.role}`);
      if (doc.user) console.log(`   User Ref: ${doc.user}, Branch: ${doc.branch}, Status: ${doc.verification_status}`);
      if (doc.company_name) console.log(`   Company: ${doc.company_name}`);
      if (doc.title) console.log(`   Title: ${doc.title}`);
      if (doc.code) console.log(`   College Code: ${doc.code}, Name: ${doc.name}`);
    });
  }

  await mongoose.disconnect();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
