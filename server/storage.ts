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
      {
        name: "Desert Sun Solar Farm",
        owner: "SolarTech Industries",
        energyType: "Solar",
        capacity: "150.5",
        location: "California, USA",
        status: "Operational",
        year: 2023,
        latitude: "34.0522",
        longitude: "-118.2437",
      },
      {
        name: "Windmere Wind Farm",
        owner: "Green Energy Corp",
        energyType: "Wind",
        capacity: "240.0",
        location: "Texas, USA",
        status: "Construction",
        year: 2024,
        latitude: "31.9686",
        longitude: "-99.9018",
      },
      {
        name: "Cascade Hydro Plant",
        owner: "Hydro Power Inc",
        energyType: "Hydro",
        capacity: "85.2",
        location: "Oregon, USA",
        status: "Operational",
        year: 2022,
        latitude: "44.9778",
        longitude: "-123.0351",
      },
      {
        name: "Mountain Wind Project",
        owner: "WindTech Solutions",
        energyType: "Wind",
        capacity: "320.0",
        location: "Colorado, USA",
        status: "Planning",
        year: 2025,
        latitude: "39.7392",
        longitude: "-104.9903",
      },
      {
        name: "Coastal Solar Array",
        owner: "Ocean Energy LLC",
        energyType: "Solar",
        capacity: "95.8",
        location: "Florida, USA",
        status: "Operational",
        year: 2023,
        latitude: "25.7617",
        longitude: "-80.1918",
      },
    ];

    for (const project of sampleProjects) {
      await this.createProject(project);
    }
  }
}

export const storage = new MemStorage();
