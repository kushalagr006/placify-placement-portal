import mongoose from 'mongoose';

async function fixRealStudents() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placement_db';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const ssipmtCollege = await db.collection('colleges').findOne({ code: 'SSIPMT' });
  if (!ssipmtCollege) {
    console.error('SSIPMT College not found!');
    process.exit(1);
  }

  // Update all remaining student profiles to be assigned to SSIPMT and Approved
  await db.collection('studentprofiles').updateMany(
    {},
    {
      $set: {
        college: ssipmtCollege._id,
        verification_status: 'Approved'
      }
    }
  );

  // Update remaining admin profiles to be assigned to SSIPMT
  await db.collection('adminprofiles').updateMany(
    {},
    {
      $set: {
        college: ssipmtCollege._id
      }
    }
  );

  console.log('✅ Real student profiles and admin profiles assigned to SSIPMT Raipur C.G and marked Approved.');

  await mongoose.disconnect();
}

fixRealStudents().catch(console.error);
