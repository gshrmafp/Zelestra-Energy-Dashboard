import { users, projects, type User, type InsertUser, type Project, type InsertProject, type ProjectFilters, type AuthUser, type ProjectStats } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(filters: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[]; total: number }>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  
  // Project operations
  getProjects(filters: ProjectFilters): Promise<{ projects: Project[]; total: number }>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<boolean>;
  
  // Statistics
  getProjectStats(): Promise<ProjectStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private currentUserId: number;
  private currentProjectId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    
    // Initialize with admin user
    this.createUser({
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "admin"
    });
    
    // Initialize with regular user
    this.createUser({
      email: "user@example.com",
      password: "user123",
      name: "Regular User",
      role: "user"
    });

    // Additional Indian users
    this.createUser({
      name: "Rajesh Kumar",
      email: "rajesh.kumar@adani.com",
      password: "rajesh123",
      role: "admin",
    });

    this.createUser({
      name: "Priya Sharma",
      email: "priya.sharma@seci.co.in",
      password: "priya123",
      role: "user",
    });

    this.createUser({
      name: "Amit Patel",
      email: "amit.patel@suzlon.com",
      password: "amit123",
      role: "user",
    });

    this.createUser({
      name: "Sunita Reddy",
      email: "sunita.reddy@kpcl.gov.in",
      password: "sunita123",
      role: "user",
    });

    this.createUser({
      name: "Vikram Singh",
      email: "vikram.singh@thdc.co.in",
      password: "vikram123",
      role: "admin",
    });

    this.createUser({
      name: "Meera Gupta",
      email: "meera.gupta@upreda.up.gov.in",
      password: "meera123",
      role: "user",
    });

    this.createUser({
      name: "Ravi Krishnan",
      email: "ravi.krishnan@tangedco.gov.in",
      password: "ravi123",
      role: "user",
    });

    this.createUser({
      name: "Kavitha Nair",
      email: "kavitha.nair@niwe.res.in",
      password: "kavitha123",
      role: "admin",
    });

    // Initialize with sample projects
    this.initializeSampleProjects();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUsers(filters: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: User[]; total: number }> {
    let users = Array.from(this.users.values());

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role filter
    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }

    const total = users.length;
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    users = users.slice(startIndex, endIndex);

    return { users, total };
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getProjects(filters: ProjectFilters): Promise<{ projects: Project[]; total: number }> {
    let filteredProjects = Array.from(this.projects.values());
    
    // Apply filters
    if (filters.energyType) {
      filteredProjects = filteredProjects.filter(p => 
        p.energyType.toLowerCase() === filters.energyType!.toLowerCase()
      );
    }
    
    if (filters.status) {
      filteredProjects = filteredProjects.filter(p => 
        p.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }
    
    if (filters.location) {
      filteredProjects = filteredProjects.filter(p => 
        p.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.owner.toLowerCase().includes(search) ||
        p.location.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredProjects.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        switch (filters.sortBy) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "capacity":
            aValue = parseFloat(a.capacity);
            bValue = parseFloat(b.capacity);
            break;
          case "year":
            aValue = a.year;
            bValue = b.year;
            break;
          case "energyType":
            aValue = a.energyType;
            bValue = b.energyType;
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }
        
        if (filters.sortOrder === "desc") {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }
    
    const total = filteredProjects.length;
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedProjects = filteredProjects.slice(offset, offset + limit);
    
    return { projects: paginatedProjects, total };
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      latitude: insertProject.latitude || null,
      longitude: insertProject.longitude || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }
    
    const updatedProject = { ...existingProject, ...updateData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getProjectStats(): Promise<ProjectStats> {
    const allProjects = Array.from(this.projects.values());
    const totalProjects = allProjects.length;
    const totalCapacity = allProjects.reduce((sum, p) => sum + parseFloat(p.capacity), 0);
    const activeLocations = new Set(allProjects.map(p => p.location)).size;
    const operational = allProjects.filter(p => p.status.toLowerCase() === "operational").length;
    
    return {
      totalProjects,
      totalCapacity,
      activeLocations,
      operational,
      percentageChanges: {
        projects: 12,
        capacity: 8,
        locations: 5,
        operational: 3,
      },
    };
  }

  private async initializeSampleProjects() {
    const sampleProjects = [
      // Solar Projects in India
      {
        name: "Rajasthan Solar Park",
        owner: "Adani Solar",
        energyType: "Solar",
        capacity: "648.0",
        location: "Jodhpur, Rajasthan",
        status: "Operational",
        year: 2023,
        latitude: "26.2389",
        longitude: "73.0243",
      },
      {
        name: "Kamuthi Solar Power Project",
        owner: "Adani Green Energy",
        energyType: "Solar",
        capacity: "648.0",
        location: "Kamuthi, Tamil Nadu",
        status: "Operational",
        year: 2016,
        latitude: "9.4004",
        longitude: "78.4479",
      },
      {
        name: "Pavagada Solar Park",
        owner: "Karnataka Solar Power Development Corporation",
        energyType: "Solar",
        capacity: "2050.0",
        location: "Pavagada, Karnataka",
        status: "Operational",
        year: 2019,
        latitude: "14.1009",
        longitude: "77.2773",
      },
      {
        name: "Kurnool Ultra Mega Solar Park",
        owner: "Andhra Pradesh Solar Power Corporation",
        energyType: "Solar",
        capacity: "1000.0",
        location: "Kurnool, Andhra Pradesh",
        status: "Operational",
        year: 2017,
        latitude: "15.8281",
        longitude: "78.0373",
      },
      {
        name: "Rewa Ultra Mega Solar Park",
        owner: "Rewa Ultra Mega Solar Limited",
        energyType: "Solar",
        capacity: "750.0",
        location: "Rewa, Madhya Pradesh",
        status: "Operational",
        year: 2020,
        latitude: "24.5318",
        longitude: "81.2961",
      },
      // Wind Projects in India
      {
        name: "Jaisalmer Wind Park",
        owner: "Suzlon Energy",
        energyType: "Wind",
        capacity: "1064.0",
        location: "Jaisalmer, Rajasthan",
        status: "Operational",
        year: 2022,
        latitude: "26.9157",
        longitude: "70.9083",
      },
      {
        name: "Muppandal Wind Farm",
        owner: "Tamil Nadu Energy Development Agency",
        energyType: "Wind",
        capacity: "1500.0",
        location: "Kanyakumari, Tamil Nadu",
        status: "Operational",
        year: 2021,
        latitude: "8.4004",
        longitude: "77.4479",
      },
      {
        name: "Gujarat Wind Park",
        owner: "Adani Green Energy",
        energyType: "Wind",
        capacity: "410.0",
        location: "Kutch, Gujarat",
        status: "Construction",
        year: 2024,
        latitude: "23.7337",
        longitude: "69.8597",
      },
      // Hydro Projects in India
      {
        name: "Tehri Dam Hydro Project",
        owner: "Tehri Hydro Development Corporation",
        energyType: "Hydro",
        capacity: "1000.0",
        location: "Tehri, Uttarakhand",
        status: "Operational",
        year: 2006,
        latitude: "30.3753",
        longitude: "78.4804",
      },
      {
        name: "Bhakra Nangal Dam",
        owner: "Bhakra Beas Management Board",
        energyType: "Hydro",
        capacity: "1325.0",
        location: "Bilaspur, Himachal Pradesh",
        status: "Operational",
        year: 1963,
        latitude: "31.4154",
        longitude: "76.4348",
      },
      {
        name: "Sardar Sarovar Dam",
        owner: "Narmada Valley Development Authority",
        energyType: "Hydro",
        capacity: "1450.0",
        location: "Kevadia, Gujarat",
        status: "Operational",
        year: 2017,
        latitude: "21.8333",
        longitude: "73.7500",
      },
      // Biomass Projects in India
      {
        name: "Punjab Biomass Power Plant",
        owner: "Punjab Renewable Energy Systems",
        energyType: "Biomass",
        capacity: "12.0",
        location: "Ludhiana, Punjab",
        status: "Operational",
        year: 2020,
        latitude: "30.9010",
        longitude: "75.8573",
      },
      {
        name: "Uttar Pradesh Biomass Plant",
        owner: "Uttar Pradesh New & Renewable Energy Development Agency",
        energyType: "Biomass",
        capacity: "15.0",
        location: "Muzaffarnagar, Uttar Pradesh",
        status: "Construction",
        year: 2024,
        latitude: "29.4727",
        longitude: "77.7085",
      },
      // Recent Projects
      {
        name: "Ladakh Solar Project",
        owner: "Solar Energy Corporation of India",
        energyType: "Solar",
        capacity: "7500.0",
        location: "Ladakh, Jammu & Kashmir",
        status: "Planning",
        year: 2025,
        latitude: "34.1526",
        longitude: "77.5771",
      },
      {
        name: "Offshore Wind Project Mumbai",
        owner: "National Institute of Wind Energy",
        energyType: "Wind",
        capacity: "1000.0",
        location: "Mumbai, Maharashtra",
        status: "Planning",
        year: 2026,
        latitude: "19.0760",
        longitude: "72.8777",
      },
      // Haryana Projects
      {
        name: "Haryana Solar Park Phase I",
        owner: "Haryana Power Generation Corporation",
        energyType: "Solar",
        capacity: "150.0",
        location: "Hisar, Haryana",
        status: "Operational",
        year: 2022,
        latitude: "29.1492",
        longitude: "75.7217",
      },
      {
        name: "Haryana Solar Park Phase II",
        owner: "Haryana Power Generation Corporation",
        energyType: "Solar",
        capacity: "200.0",
        location: "Sirsa, Haryana",
        status: "Construction",
        year: 2024,
        latitude: "29.5321",
        longitude: "75.0318",
      },
      {
        name: "Yamuna Wind Farm",
        owner: "Haryana Renewable Energy Development Agency",
        energyType: "Wind",
        capacity: "75.0",
        location: "Panipat, Haryana",
        status: "Operational",
        year: 2021,
        latitude: "29.3909",
        longitude: "76.9635",
      },
      {
        name: "Gurgaon Rooftop Solar Project",
        owner: "Haryana Energy Development Agency",
        energyType: "Solar",
        capacity: "25.0",
        location: "Gurgaon, Haryana",
        status: "Operational",
        year: 2020,
        latitude: "28.4595",
        longitude: "77.0266",
      },
      {
        name: "DLF Cyber City Solar Installation",
        owner: "DLF Limited",
        energyType: "Solar",
        capacity: "15.0",
        location: "Gurgaon, Haryana",
        status: "Operational",
        year: 2021,
        latitude: "28.4937",
        longitude: "77.0931",
      },
      {
        name: "Manesar Industrial Solar Park",
        owner: "Haryana State Industrial Development Corporation",
        energyType: "Solar",
        capacity: "50.0",
        location: "Manesar, Haryana",
        status: "Construction",
        year: 2024,
        latitude: "28.3660",
        longitude: "76.9382",
      },
      
      // Delhi Projects
      {
        name: "Delhi-NCR Solar City Initiative",
        owner: "Delhi Metro Rail Corporation",
        energyType: "Solar",
        capacity: "35.0",
        location: "New Delhi, Delhi",
        status: "Operational",
        year: 2022,
        latitude: "28.6139",
        longitude: "77.2090",
      },
      {
        name: "Pragati Maidan Solar Project",
        owner: "Delhi Government",
        energyType: "Solar",
        capacity: "10.0",
        location: "New Delhi, Delhi",
        status: "Operational",
        year: 2022,
        latitude: "28.6181",
        longitude: "77.2410",
      },
      {
        name: "IGI Airport Solar Installation",
        owner: "Delhi International Airport Limited",
        energyType: "Solar",
        capacity: "7.84",
        location: "New Delhi, Delhi",
        status: "Operational",
        year: 2020,
        latitude: "28.5562",
        longitude: "77.0998",
      },
      {
        name: "Delhi Ridge Biomass Plant",
        owner: "Delhi Energy Development Agency",
        energyType: "Biomass",
        capacity: "5.0",
        location: "New Delhi, Delhi",
        status: "Planning",
        year: 2025,
        latitude: "28.6794",
        longitude: "77.1025",
      },
      {
        name: "Delhi University Solar Campus",
        owner: "Delhi University",
        energyType: "Solar",
        capacity: "3.5",
        location: "New Delhi, Delhi",
        status: "Operational",
        year: 2021,
        latitude: "28.6898",
        longitude: "77.2099",
      },
      
      // Noida Projects
      {
        name: "Noida Greater Solar Park",
        owner: "Uttar Pradesh New & Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "125.0",
        location: "Greater Noida, Uttar Pradesh",
        status: "Operational",
        year: 2022,
        latitude: "28.4744",
        longitude: "77.5040",
      },
      {
        name: "Noida Expressway Solar Project",
        owner: "Noida Authority",
        energyType: "Solar",
        capacity: "30.0",
        location: "Noida, Uttar Pradesh",
        status: "Construction",
        year: 2024,
        latitude: "28.5697",
        longitude: "77.3311",
      },
      {
        name: "Tech Park Noida Solar Installation",
        owner: "Uttar Pradesh Power Corporation",
        energyType: "Solar",
        capacity: "12.5",
        location: "Noida, Uttar Pradesh",
        status: "Operational",
        year: 2022,
        latitude: "28.5355",
        longitude: "77.3910",
      },
      {
        name: "Sector 135 Solar Project",
        owner: "Noida Green Initiative",
        energyType: "Solar",
        capacity: "18.0",
        location: "Noida, Uttar Pradesh",
        status: "Planning",
        year: 2025,
        latitude: "28.5123",
        longitude: "77.4029",
      },
      
      // Add more projects in other locations around India
      {
        name: "Chandigarh Solar City Project",
        owner: "Chandigarh Renewable Energy Science & Technology",
        energyType: "Solar",
        capacity: "45.0",
        location: "Chandigarh, Punjab",
        status: "Operational",
        year: 2021,
        latitude: "30.7333",
        longitude: "76.7794",
      },
      {
        name: "Jaipur Metro Solar Project",
        owner: "Rajasthan Renewable Energy Corporation",
        energyType: "Solar",
        capacity: "28.0",
        location: "Jaipur, Rajasthan",
        status: "Operational",
        year: 2023,
        latitude: "26.9124",
        longitude: "75.7873",
      },
      {
        name: "Pune Smart City Solar Initiative",
        owner: "Maharashtra State Power Generation Company",
        energyType: "Solar",
        capacity: "55.0",
        location: "Pune, Maharashtra",
        status: "Operational",
        year: 2022,
        latitude: "18.5204",
        longitude: "73.8567",
      },
      {
        name: "Bangalore Tech Corridor Solar Project",
        owner: "Karnataka Renewable Energy Development Ltd",
        energyType: "Solar",
        capacity: "75.0",
        location: "Bangalore, Karnataka",
        status: "Construction",
        year: 2024,
        latitude: "12.9716",
        longitude: "77.5946",
      },
      {
        name: "Chennai Coastal Wind Farm",
        owner: "Tamil Nadu Energy Development Agency",
        energyType: "Wind",
        capacity: "120.0",
        location: "Chennai, Tamil Nadu",
        status: "Operational",
        year: 2022,
        latitude: "13.0827",
        longitude: "80.2707",
      },
      {
        name: "Hyderabad Solar City",
        owner: "Telangana State Renewable Energy Development Corp",
        energyType: "Solar",
        capacity: "90.0",
        location: "Hyderabad, Telangana",
        status: "Operational",
        year: 2021,
        latitude: "17.3850",
        longitude: "78.4867",
      },
      {
        name: "Kolkata East Solar Project",
        owner: "West Bengal Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "40.0",
        location: "Kolkata, West Bengal",
        status: "Construction",
        year: 2024,
        latitude: "22.5726",
        longitude: "88.3639",
      },
      {
        name: "Bhopal Solar Installation",
        owner: "Madhya Pradesh Urja Vikas Nigam",
        energyType: "Solar",
        capacity: "35.0",
        location: "Bhopal, Madhya Pradesh",
        status: "Operational",
        year: 2023,
        latitude: "23.2599",
        longitude: "77.4126",
      },
      {
        name: "Lucknow Solar City Project",
        owner: "Uttar Pradesh New & Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "50.0",
        location: "Lucknow, Uttar Pradesh",
        status: "Planning",
        year: 2025,
        latitude: "26.8467",
        longitude: "80.9462",
      },
      {
        name: "Ahmedabad Solar Park",
        owner: "Gujarat Energy Development Agency",
        energyType: "Solar",
        capacity: "65.0",
        location: "Ahmedabad, Gujarat",
        status: "Operational",
        year: 2022,
        latitude: "23.0225",
        longitude: "72.5714",
      },
      {
        name: "Dehradun Solar Valley",
        owner: "Uttarakhand Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "30.0",
        location: "Dehradun, Uttarakhand",
        status: "Construction",
        year: 2024,
        latitude: "30.3165",
        longitude: "78.0322",
      },
      {
        name: "Raipur Green Energy Hub",
        owner: "Chhattisgarh State Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "45.0",
        location: "Raipur, Chhattisgarh",
        status: "Planning",
        year: 2025,
        latitude: "21.2514",
        longitude: "81.6296",
      },
      
      // Additional Projects
      {
        name: "Faridabad Industrial Solar Project",
        owner: "Haryana Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "40.0",
        location: "Faridabad, Haryana",
        status: "Construction",
        year: 2024,
        latitude: "28.4089",
        longitude: "77.3178",
      },
      {
        name: "Sonipat Green Energy Park",
        owner: "Haryana Power Generation Corporation",
        energyType: "Solar",
        capacity: "35.0",
        location: "Sonipat, Haryana",
        status: "Planning",
        year: 2025,
        latitude: "28.9931",
        longitude: "77.0151",
      },
      {
        name: "Karnal Biomass Plant",
        owner: "Haryana Renewable Energy Development Agency",
        energyType: "Biomass",
        capacity: "10.0",
        location: "Karnal, Haryana",
        status: "Operational",
        year: 2023,
        latitude: "29.6857",
        longitude: "76.9905",
      },
      {
        name: "Ghaziabad Solar City",
        owner: "Uttar Pradesh New & Renewable Energy Development Agency",
        energyType: "Solar",
        capacity: "28.0",
        location: "Ghaziabad, Uttar Pradesh",
        status: "Construction",
        year: 2024,
        latitude: "28.6692",
        longitude: "77.4538",
      },
      {
        name: "Meerut Green Energy Hub",
        owner: "Uttar Pradesh Power Corporation",
        energyType: "Solar",
        capacity: "32.0",
        location: "Meerut, Uttar Pradesh",
        status: "Planning",
        year: 2025,
        latitude: "28.9845",
        longitude: "77.7064",
      }
    ];

    for (const project of sampleProjects) {
      await this.createProject(project);
    }
  }
}

export const storage = new MemStorage();
