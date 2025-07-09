import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./services/auth";
import { energyAPIService } from "./services/energy-api";
import { loginSchema, projectFiltersSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";

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
      const filters = projectFiltersSchema.parse(req.query);
      const result = await storage.getProjects(filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/projects/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
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
      const id = parseInt(req.params.id);
      const updateData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, updateData);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/projects/:id", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
    Solar: "#FF9800",
    Wind: "#1976D2",
    Hydro: "#2196F3",
    Biomass: "#4CAF50",
    Geothermal: "#9C27B0",
  };
  return colors[type] || "#666666";
}
