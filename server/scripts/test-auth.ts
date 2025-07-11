import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.model';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zelestra';

async function testAuth() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Try to find the test user
    const testUser = await User.findOne({ email: 'user@example.com' });
    if (!testUser) {
      console.log('Test user not found');
      return;
    }

    // Test password comparison
    const testPassword = 'user123';
    const isMatch = await testUser.comparePassword(testPassword);
    console.log('Password comparison result:', isMatch);
    console.log('Stored password hash:', testUser.password);
    
    // Create a new hash for comparison
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);
    console.log('New hash of same password:', newHash);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAuth();
