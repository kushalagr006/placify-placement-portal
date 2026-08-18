import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { User } from '../backend_node/models/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal';

async function listUsers() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({}, 'name email role');
  console.log('Current MongoDB Registered Users:');
  users.forEach((u) => {
    console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`);
  });
  await mongoose.disconnect();
}

listUsers().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
