import { foodItems, type FoodItem, type InsertFoodItem } from "@shared/schema";
import { compareAsc, isBefore, parseISO, startOfToday } from "date-fns";

// Storage interface
export interface IStorage {
  // User related operations (keeping as a reference)
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Food item operations
  getAllFoodItems(): Promise<FoodItem[]>;
  getFoodItemById(id: number): Promise<FoodItem | undefined>;
  getFoodItemsByCategory(category: string): Promise<FoodItem[]>;
  getExpiringFoodItems(days: number): Promise<FoodItem[]>;
  createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem>;
  updateFoodItem(id: number, updates: Partial<InsertFoodItem>): Promise<FoodItem | undefined>;
  deleteFoodItem(id: number): Promise<boolean>;
  markAsNotified(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private foodItems: Map<number, FoodItem>;
  private foodItemsCurrentId: number;
  private usersCurrentId: number;

  constructor() {
    this.users = new Map();
    this.foodItems = new Map();
    this.foodItemsCurrentId = 1;
    this.usersCurrentId = 1;
  }

  // User related operations
  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.usersCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Food item operations
  async getAllFoodItems(): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values()).sort((a, b) => {
      // Sort by expiration date (ascending)
      const dateA = new Date(a.expirationDate);
      const dateB = new Date(b.expirationDate);
      return compareAsc(dateA, dateB);
    });
  }

  async getFoodItemById(id: number): Promise<FoodItem | undefined> {
    return this.foodItems.get(id);
  }

  async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    return Array.from(this.foodItems.values())
      .filter(item => item.category === category)
      .sort((a, b) => {
        // Sort by expiration date (ascending)
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        return compareAsc(dateA, dateB);
      });
  }

  async getExpiringFoodItems(days: number): Promise<FoodItem[]> {
    const today = startOfToday();
    const expirationThreshold = new Date();
    expirationThreshold.setDate(today.getDate() + days);
    
    return Array.from(this.foodItems.values())
      .filter(item => {
        const expirationDate = new Date(item.expirationDate);
        return isBefore(expirationDate, expirationThreshold) && 
               !isBefore(expirationDate, today);
      })
      .sort((a, b) => {
        // Sort by expiration date (ascending)
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        return compareAsc(dateA, dateB);
      });
  }

  async createFoodItem(foodItem: InsertFoodItem): Promise<FoodItem> {
    const id = this.foodItemsCurrentId++;
    const now = new Date();
    
    // Handle date string or Date object
    let expirationDate: Date;
    if (typeof foodItem.expirationDate === 'string') {
      expirationDate = parseISO(foodItem.expirationDate);
    } else {
      expirationDate = foodItem.expirationDate;
    }
    
    const newFoodItem: FoodItem = {
      ...foodItem,
      id,
      expirationDate,
      createdAt: now,
      notified: false
    };
    
    this.foodItems.set(id, newFoodItem);
    return newFoodItem;
  }

  async updateFoodItem(id: number, updates: Partial<InsertFoodItem>): Promise<FoodItem | undefined> {
    const foodItem = this.foodItems.get(id);
    
    if (!foodItem) {
      return undefined;
    }
    
    // Handle date string or Date object for expiration date
    let expirationDate = foodItem.expirationDate;
    if (updates.expirationDate) {
      if (typeof updates.expirationDate === 'string') {
        expirationDate = parseISO(updates.expirationDate);
      } else {
        expirationDate = updates.expirationDate;
      }
    }
    
    const updatedFoodItem: FoodItem = {
      ...foodItem,
      ...updates,
      expirationDate,
      id // Ensure ID remains the same
    };
    
    this.foodItems.set(id, updatedFoodItem);
    return updatedFoodItem;
  }

  async deleteFoodItem(id: number): Promise<boolean> {
    return this.foodItems.delete(id);
  }
  
  async markAsNotified(id: number): Promise<void> {
    const foodItem = this.foodItems.get(id);
    if (foodItem) {
      foodItem.notified = true;
      this.foodItems.set(id, foodItem);
    }
  }
}

export const storage = new MemStorage();
