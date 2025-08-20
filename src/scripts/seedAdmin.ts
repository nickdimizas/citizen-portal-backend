import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import { User, IUser, UserRole } from '../models/user.model';

const MONGO_URI = process.env.MONGO_URI;

async function seedAdmin() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not found in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ role: UserRole.Admin });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      return;
    }

    const adminUser: Partial<IUser> = {
      username: 'admin',
      email: 'admin@admin.com',
      password: 'admin123!', // plain text, will be hashed automatically
      role: UserRole.Admin,
      firstname: 'Admin',
      lastname: 'Admin',
      phoneNumber: '1234567890',
      address: {
        city: 'City',
        street: 'Street',
        number: '123',
        postcode: '00000',
      },
      ssn: '012345678',
      active: true,
    };

    await User.create(adminUser);

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
