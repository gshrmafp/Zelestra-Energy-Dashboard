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
    ];

    for (const project of sampleProjects) {
      await this.createProject(project);
    }
  }
}

export const storage = new MemStorage();
