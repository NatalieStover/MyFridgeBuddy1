import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { addDays, isBefore, parseISO, startOfToday } from "date-fns";
import { insertFoodItemSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all food items
  app.get("/api/food-items", async (req, res) => {
    try {
      const allItems = await storage.getAllFoodItems();
      res.json(allItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      res.status(500).json({ message: "Failed to fetch food items" });
    }
  });

  // Get food items by category
  app.get("/api/food-items/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!category) {
        return res.status(400).json({ message: "Category parameter is required" });
      }

      const items = await storage.getFoodItemsByCategory(category);
      res.json(items);
    } catch (error) {
      console.error(`Error fetching food items in category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch food items by category" });
    }
  });

  // Get expiring food items
  app.get("/api/food-items/expiring/:days", async (req, res) => {
    try {
      const days = parseInt(req.params.days, 10) || 3; // Default to 3 days if not specified
      const expiringItems = await storage.getExpiringFoodItems(days);
      res.json(expiringItems);
    } catch (error) {
      console.error(`Error fetching expiring items within ${req.params.days} days:`, error);
      res.status(500).json({ message: "Failed to fetch expiring food items" });
    }
  });

  // Get a specific food item
  app.get("/api/food-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await storage.getFoodItemById(id);

      if (!item) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.json(item);
    } catch (error) {
      console.error(`Error fetching food item ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch food item" });
    }
  });

  // Create a new food item
  app.post("/api/food-items", async (req, res) => {
    try {
      const foodItemData = insertFoodItemSchema.parse(req.body);
      const newFoodItem = await storage.createFoodItem(foodItemData);
      res.status(201).json(newFoodItem);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating food item:", error);
        res.status(500).json({ message: "Failed to create food item" });
      }
    }
  });

  // Update a food item
  app.patch("/api/food-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updates = req.body;

      // Validate only the fields that are provided
      const validUpdates = {};
      for (const [key, value] of Object.entries(updates)) {
        if (insertFoodItemSchema.shape[key]) {
          validUpdates[key] = value;
        }
      }

      const updatedItem = await storage.updateFoodItem(id, validUpdates);

      if (!updatedItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error(`Error updating food item ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update food item" });
    }
  });

  // Delete a food item
  app.delete("/api/food-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const success = await storage.deleteFoodItem(id);

      if (!success) {
        return res.status(404).json({ message: "Food item not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error(`Error deleting food item ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete food item" });
    }
  });

  // Get notification for expiring items
  app.get("/api/notifications", async (req, res) => {
    try {
      // Get items expiring in the next 3 days that haven't been notified yet
      const expiringItems = await storage.getExpiringFoodItems(3);
      const notifications = expiringItems.filter(item => !item.notified);

      for (const item of notifications) {
        await storage.markAsNotified(item.id);
      }

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}