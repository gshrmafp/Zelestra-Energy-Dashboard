import { compare, hash } from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AuthUser, LoginCredentials } from "@shared/schema";
import { MongoDBService } from "./mongodb.service";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure environment variables are loaded
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const storage = new MongoDBService();

// Get environment variables, with fallbacks for development
const JWT_SECRET: string = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// Only throw the error if actually using auth functionality
export class AuthService {
  constructor() {
    // Check JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.warn("Warning: JWT_SECRET not found in environment variables. Authentication will fail when needed.");
    }
  }
  
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    // Check JWT secret before attempting to use it
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be defined in environment variables");
    }
    
    console.log("Attempting login for email:", credentials.email);
    const user = await storage.getUserByEmail(credentials.email);
    
    if (!user) {
      console.log("No user found with email:", credentials.email);
      throw new Error("Invalid credentials");
    }

    console.log("User found, comparing password");
    const isValidPassword = await user.comparePassword(credentials.password);
    
    console.log("Password validation result:", isValidPassword);
    
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Use process.env.JWT_SECRET directly to ensure we get the current value
    const token = jwt.sign(authUser as object, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    });

    return { user: authUser, token };
  }

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      // Use process.env.JWT_SECRET directly to ensure we get the current value
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined in environment variables");
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthUser;
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async comparePasswords(plaintext: string, hashed: string): Promise<boolean> {
    return compare(plaintext, hashed);
  }
}

export const authService = new AuthService();
