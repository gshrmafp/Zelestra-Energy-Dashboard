import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUser, LoginCredentials } from "@shared/schema";
import { storage } from "../storage";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const user = await storage.getUserByEmail(credentials.email);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // For demo purposes, simple password check
    // In production, use bcrypt
    const isValidPassword = user.password === credentials.password;
    
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user: authUser, token };
  }

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
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
