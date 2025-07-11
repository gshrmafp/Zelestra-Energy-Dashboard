import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.model';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zelestra';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function updatePasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    // Update each user's password
    for (const user of users) {
      const plainTextPassword = user.password;
      // Force rehash all passwords
      user.password = await hashPassword(plainTextPassword);
      await user.save();
      console.log(`Updated password for user: ${user.email}`);
    }
    
    console.log('All passwords have been updated');
    process.exit(0);
  } catch (error) {
    console.error('Error updating passwords:', error);
    process.exit(1);
  }
}

updatePasswords();
