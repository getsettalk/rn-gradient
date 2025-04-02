import { users, type User, type InsertUser, type Gradient } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Gradient storage operations
  saveGradient(gradient: Gradient): Promise<Gradient>;
  getGradient(id: string): Promise<Gradient | undefined>;
  getAllGradients(): Promise<Gradient[]>;
  deleteGradient(id: string): Promise<boolean>;
  deleteAllGradients(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gradients: Map<string, Gradient>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.gradients = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveGradient(gradient: Gradient): Promise<Gradient> {
    if (!gradient.id) {
      throw new Error("Gradient must have an ID");
    }
    
    this.gradients.set(gradient.id, gradient);
    return gradient;
  }

  async getGradient(id: string): Promise<Gradient | undefined> {
    return this.gradients.get(id);
  }

  async getAllGradients(): Promise<Gradient[]> {
    return Array.from(this.gradients.values());
  }

  async deleteGradient(id: string): Promise<boolean> {
    return this.gradients.delete(id);
  }

  async deleteAllGradients(): Promise<void> {
    this.gradients.clear();
  }
}

export const storage = new MemStorage();
