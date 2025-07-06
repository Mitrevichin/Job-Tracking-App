import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const demoUserId = new mongoose.Types.ObjectId('685feef1619833ec7a8094ff');

async function seedDemoUser() {
  await mongoose.connect(process.env.MONGO_URL);

  const existingUser = await UserModel.findById(demoUserId);
  if (existingUser) {
    console.log('Demo user already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('secret123', 10);

  const demoUser = new UserModel({
    _id: demoUserId,
    email: 'test@test.com',
    password: hashedPassword,
    role: 'user',
    name: 'Demo User',
  });

  await demoUser.save();
  console.log('Demo user created');
  process.exit(0);
}

seedDemoUser().catch(console.error);
