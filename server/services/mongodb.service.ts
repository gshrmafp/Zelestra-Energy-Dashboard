import mongoose from 'mongoose';
import { ProjectFilters, ProjectStats } from "@shared/schema";
import User, { IUser } from "../models/user.model";
import Project, { IProject } from "../models/project.model";

// We'll only connect if we haven't already
let isConnected = false;

// Initialize MongoDB connection only if not already connected
const connectToMongoDB = async () => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string, {});
      isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }
};

export class MongoDBService {
  constructor() {
    // Ensure connection on service instantiation
    connectToMongoDB();
  }

  // User operations
  async getUser(id: string): Promise<IUser | null> {
    await connectToMongoDB();
    return User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await connectToMongoDB();
    return User.findOne({ email });
  }

  async createUser(userData: { email: string, password: string, name: string, role?: string }): Promise<IUser> {
    const user = new User({
      ...userData,
      role: userData.role || 'user'
    });
    return user.save();
  }

  async getUsers(filters: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: IUser[]; total: number }> {
    const query: any = {};
    
    if (filters.role) {
      query.role = filters.role;
    }
    
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit),
      User.countDocuments(query)
    ]);
    
    return { users, total };
  }

  async updateUser(id: string, userData: Partial<{ email: string, password: string, name: string, role: string }>): Promise<IUser | null> {
    // If updating password, ensure we use the User model's save method to trigger the password hash middleware
    if (userData.password) {
      const user = await User.findById(id);
      if (!user) return null;
      
      if (userData.email) user.email = userData.email;
      if (userData.password) user.password = userData.password;
      if (userData.name) user.name = userData.name;
      if (userData.role) user.role = userData.role;
      
      return user.save();
    }
    
    // For non-password updates, we can use findByIdAndUpdate
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Project operations
  async getProjects(filters: ProjectFilters): Promise<{ projects: IProject[]; total: number }> {
    const query: any = {};
    
    if (filters.energyType) {
      query.energyType = filters.energyType;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query.$or = [
        { name: searchRegex },
        { owner: searchRegex }
      ];
    }
    
    const sortOptions: any = {};
    if (filters.sortBy) {
      sortOptions[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default sort by creation date, newest first
    }
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOptions).skip(skip).limit(limit),
      Project.countDocuments(query)
    ]);
    
    return { projects, total };
  }

  async getProject(id: string): Promise<IProject | null> {
    return Project.findById(id);
  }

  async createProject(projectData: any): Promise<IProject> {
    const project = new Project(projectData);
    return project.save();
  }

  async updateProject(id: string, projectData: any): Promise<IProject | null> {
    return Project.findByIdAndUpdate(id, projectData, { new: true });
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await Project.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Statistics
  async getProjectStats(): Promise<ProjectStats> {
    const [
      totalProjects,
      totalCapacityResult,
      activeLocations,
      operational
    ] = await Promise.all([
      Project.countDocuments(),
      Project.aggregate([
        { $group: { _id: null, total: { $sum: "$capacity" } } }
      ]),
      Project.distinct('location').then(locations => locations.length),
      Project.countDocuments({ status: 'operational' })
    ]);
    
    const totalCapacity = totalCapacityResult.length > 0 ? totalCapacityResult[0].total : 0;
    
    // Calculate percentage changes (in a real app, you would compare with previous period)
    // Here we're just using some random changes as placeholders
    const percentageChanges = {
      projects: 15.2,
      capacity: 22.7,
      locations: 8.4,
      operational: 12.9
    };
    
    return {
      totalProjects,
      totalCapacity,
      activeLocations,
      operational,
      percentageChanges
    };
  }
}
