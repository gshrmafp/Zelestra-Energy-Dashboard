import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  energyType: text("energy_type").notNull(),
  capacity: decimal("capacity", { precision: 10, scale: 2 }).notNull(),
  location: text("location").notNull(),
  status: text("status").notNull(),
  year: integer("year").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const projectFiltersSchema = z.object({
  energyType: z.string().optional(),
  status: z.string().optional(),
  location: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "capacity", "year", "energyType"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectFilters = z.infer<typeof projectFiltersSchema>;

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface ProjectStats {
  totalProjects: number;
  totalCapacity: number;
  activeLocations: number;
  operational: number;
  percentageChanges: {
    projects: number;
    capacity: number;
    locations: number;
    operational: number;
  };
}

export interface ChartData {
  capacityTrends: Array<{
    month: string;
    capacity: number;
  }>;
  energyDistribution: Array<{
    type: string;
    percentage: number;
    color: string;
  }>;
}
