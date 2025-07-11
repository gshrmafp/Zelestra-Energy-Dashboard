import type { Express } from "express";
import { createServer, type Server } from "http";
import { authService } from "./services/auth";
import { energyAPIService } from "./services/energy-api";
import { loginSchema, projectFiltersSchema, insertProjectSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { createProjectsExcel } from "./utils/excel";
import { MongoDBService } from "./services/mongodb.service";

// Initialize MongoDB Service
const storage = new MongoDBService();

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Shorter aliases for convenience
const requireAuth = authenticateToken;

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await authService.login(credentials);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/verify", authenticateToken, async (req: any, res) => {
    res.json({ user: req.user });
  });

  // Project routes
  app.get("/api/projects", authenticateToken, async (req: any, res) => {
    try {
      // Parse query parameters properly
      const query = { ...req.query };
      
      // Convert page and limit to numbers
      if (query.page) query.page = parseInt(query.page);
      if (query.limit) query.limit = parseInt(query.limit);
      
      const filters = projectFiltersSchema.parse(query);
      const result = await storage.getProjects(filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = req.params.id;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/projects", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/projects/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      const updateData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, updateData);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Export projects to CSV (admin only)
  app.get("/api/export/projects", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const { projects } = await storage.getProjects({});
      
      const csvHeader = "Name,Owner,Energy Type,Capacity (MW),Location,Status,Year,Latitude,Longitude\n";
      const csvData = projects.map(project => 
        `"${project.name}","${project.owner}","${project.energyType}","${project.capacity}","${project.location}","${project.status}","${project.year}","${project.latitude || ''}","${project.longitude || ''}"`
      ).join("\n");
      
      const csv = csvHeader + csvData;
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="projects_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Export projects to Excel (admin only)
  app.get("/api/export/projects/excel", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const { projects } = await storage.getProjects({});
      const { createProjectsExcel } = await import('./utils/excel');
      
      // Convert MongoDB documents to plain objects if needed
      const plainProjects = projects.map(project => project.toObject ? project.toObject() : project);
      
      const buffer = await createProjectsExcel(plainProjects);
      
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename="projects_${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Statistics route
  app.get("/api/stats", authenticateToken, async (req: any, res) => {
    try {
      const stats = await storage.getProjectStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Chart data route
  app.get("/api/charts", authenticateToken, async (req: any, res) => {
    try {
      const projects = await storage.getProjects({});
      
      // Generate capacity trends data
      const capacityTrends = [
        { month: "Jan", capacity: 1200 },
        { month: "Feb", capacity: 1350 },
        { month: "Mar", capacity: 1500 },
        { month: "Apr", capacity: 1750 },
        { month: "May", capacity: 2000 },
        { month: "Jun", capacity: 2200 },
      ];
      
      // Generate energy distribution data
      const energyTypes = projects.projects.reduce((acc: any, project) => {
        acc[project.energyType] = (acc[project.energyType] || 0) + 1;
        return acc;
      }, {});
      
      const total = Object.values(energyTypes).reduce((sum: number, count: any) => sum + count, 0);
      
      const energyDistribution = Object.entries(energyTypes).map(([type, count]: [string, any]) => ({
        type,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: getEnergyTypeColor(type),
      }));
      
      res.json({
        capacityTrends,
        energyDistribution,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User management routes (admin only)
  app.get("/api/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const query = { ...req.query };
      
      // Convert page and limit to numbers
      if (query.page) query.page = parseInt(query.page);
      if (query.limit) query.limit = parseInt(query.limit);
      
      const users = await storage.getUsers(query);
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/users/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Export projects route (admin only)
  app.get("/api/projects/export", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { projects } = await storage.getProjects({});
      
      // Generate CSV format
      const csvHeaders = "Name,Owner,Energy Type,Capacity (MW),Location,Status,Year,Latitude,Longitude\n";
      const csvData = projects.map(p => 
        `"${p.name}","${p.owner}","${p.energyType}","${p.capacity}","${p.location}","${p.status}","${p.year}","${p.latitude || ''}","${p.longitude || ''}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="renewable_energy_projects.csv"');
      res.send(csvHeaders + csvData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Export projects as Excel (admin only)
  app.get("/api/projects/export/excel", authenticateToken, async (req: any, res) => {
    try {
      const { projects } = await storage.getProjects({});
      
      // Convert MongoDB documents to plain objects if needed
      const plainProjects = projects.map(project => project.toObject ? project.toObject() : project);
      
      // Use the Excel utility to create an Excel file
      const buffer = await createProjectsExcel(plainProjects);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="renewable_energy_projects.xlsx"');
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // External API sync route (admin only)
  app.post("/api/sync/external", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const externalProjects = await energyAPIService.fetchRenewableProjects();
      
      // Add external projects to storage
      const addedProjects = [];
      for (const projectData of externalProjects) {
        const project = await storage.createProject(projectData);
        addedProjects.push(project);
      }
      
      res.json({ 
        message: `Successfully synced ${addedProjects.length} projects`,
        projects: addedProjects
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getEnergyTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    solar: "#FF9800",
    wind: "#1976D2",
    hydro: "#2196F3",
    biomass: "#4CAF50",
    geothermal: "#9C27B0",
    other: "#666666"
  };
  return colors[type] || "#666666";
}
