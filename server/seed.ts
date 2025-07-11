import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model';
import Project from './models/project.model';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI as string;

// Sample users data
const users = [
  {
    email: "admin@example.com",
    password: "admin123", // Will be hashed by the pre-save hook
    name: "Admin User",
    role: "admin"
  },
  {
    email: "user@example.com",
    password: "user123", 
    name: "Regular User",
    role: "user"
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@adani.com",
    password: "rajesh123",
    role: "admin",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@seci.co.in",
    password: "priya123",
    role: "user",
  },
  {
    name: "Amit Patel",
    email: "amit.patel@suzlon.com",
    password: "amit123",
    role: "user",
  },
  {
    name: "Sunita Reddy",
    email: "sunita.reddy@kpcl.gov.in",
    password: "sunita123",
    role: "user",
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@thdc.co.in",
    password: "vikram123",
    role: "admin",
  }
];

// Sample projects data
const projects = [
  {
    name: "Bhadla Solar Park",
    owner: "Rajasthan Solar Park Development Company",
    energyType: "solar",
    capacity: 2245,
    location: "Rajasthan, India",
    status: "operational",
    year: 2021,
    latitude: 27.5330,
    longitude: 71.9084
  },
  {
    name: "Pavagada Solar Park",
    owner: "Karnataka Solar Power Development Corporation",
    energyType: "solar",
    capacity: 2050,
    location: "Karnataka, India",
    status: "operational",
    year: 2019,
    latitude: 14.1223,
    longitude: 77.2858
  },
  {
    name: "Kurnool Ultra Mega Solar Park",
    owner: "Andhra Pradesh Solar Power Corporation",
    energyType: "solar",
    capacity: 1000,
    location: "Andhra Pradesh, India",
    status: "operational",
    year: 2017,
    latitude: 15.6295,
    longitude: 77.4086
  },
  {
    name: "Rewa Ultra Mega Solar Park",
    owner: "Rewa Ultra Mega Solar Limited",
    energyType: "solar",
    capacity: 750,
    location: "Madhya Pradesh, India",
    status: "operational",
    year: 2018,
    latitude: 24.0798,
    longitude: 81.3241
  },
  {
    name: "Muppandal Wind Farm",
    owner: "Tamil Nadu Energy Development Agency",
    energyType: "wind",
    capacity: 1500,
    location: "Tamil Nadu, India",
    status: "operational",
    year: 2000,
    latitude: 8.2472,
    longitude: 77.4825
  },
  {
    name: "Jaisalmer Wind Park",
    owner: "Suzlon Energy",
    energyType: "wind",
    capacity: 1064,
    location: "Rajasthan, India",
    status: "operational",
    year: 2012,
    latitude: 26.9124,
    longitude: 70.9624
  },
  {
    name: "Brahmaputra Hydroelectric Project",
    owner: "NHPC Limited",
    energyType: "hydro",
    capacity: 2800,
    location: "Assam, India",
    status: "planning",
    year: 2027,
    latitude: 27.5336,
    longitude: 94.8200
  },
  {
    name: "Tehri Dam",
    owner: "THDC India Ltd",
    energyType: "hydro",
    capacity: 2400,
    location: "Uttarakhand, India",
    status: "operational",
    year: 2006,
    latitude: 30.3787,
    longitude: 78.4802
  },
  {
    name: "Narmada Valley Biomass Plant",
    owner: "Madhya Pradesh Bioenergy Development Corporation",
    energyType: "biomass",
    capacity: 50,
    location: "Madhya Pradesh, India",
    status: "in-progress",
    year: 2023,
    latitude: 22.3148,
    longitude: 75.0412
  },
  {
    name: "Puga Valley Geothermal Project",
    owner: "ONGC Energy",
    energyType: "geothermal",
    capacity: 20,
    location: "Ladakh, India",
    status: "planning",
    year: 2025,
    latitude: 33.1825,
    longitude: 78.3859
  },
  {
    name: "Mumbai Offshore Wind Project",
    owner: "National Institute of Wind Energy",
    energyType: "wind",
    capacity: 1000,
    location: "Maharashtra, India",
    status: "planning",
    year: 2026,
    latitude: 19.1231,
    longitude: 72.8308
  },
  {
    name: "Charanka Solar Park",
    owner: "Gujarat Power Corporation Limited",
    energyType: "solar",
    capacity: 600,
    location: "Gujarat, India",
    status: "operational",
    year: 2016,
    latitude: 23.8948,
    longitude: 71.1513
  }
];

// Connect to MongoDB and seed data
async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing collections
    await User.deleteMany({});
    console.log('Cleared users collection');
    
    await Project.deleteMany({});
    console.log('Cleared projects collection');
    
    // Insert sample users
    await User.insertMany(users);
    console.log('Added sample users');
    
    // Insert sample projects
    await Project.insertMany(projects);
    console.log('Added sample projects');
    
    console.log('Database seeded successfully!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
