import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema kept as a reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Food item categories
export const FOOD_CATEGORIES = [
  "dairy",
  "vegetables",
  "fruits",
  "meats",
  "grains",
  "beverages",
  "other"
] as const;

// Measurement units
export const MEASUREMENT_UNITS = [
  "pcs",
  "kg",
  "g",
  "ml",
  "l",
  "box",
  "bag",
  "bottle",
  "can",
  "cup",
  "tbsp",
  "tsp",
  "bunch",
  "slice",
  "loaf",
  "pack",
  "custom"
] as const;

// Food items table
export const foodItems = pgTable("food_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category")
    .$type<typeof FOOD_CATEGORIES[number]>()
    .notNull()
    .default("other"),
  quantity: integer("quantity").notNull().default(1),
  unit: text("unit")
    .$type<typeof MEASUREMENT_UNITS[number]>()
    .notNull()
    .default("pcs"),
  expirationDate: timestamp("expiration_date").notNull(),
  notes: text("notes"),
  customUnit: text("custom_unit"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  notified: boolean("notified").notNull().default(false),
});

// Create zod schema for inserts
export const insertFoodItemSchema = createInsertSchema(foodItems)
  .omit({ id: true, createdAt: true, notified: true })
  .extend({
    category: z.enum(FOOD_CATEGORIES),
    unit: z.enum(MEASUREMENT_UNITS),
    expirationDate: z.string().or(z.date()),
    quantity: z.number().positive(),
    customUnit: z.string().optional(),
  });

// Define export types
export type FoodCategory = typeof FOOD_CATEGORIES[number];
export type MeasurementUnit = typeof MEASUREMENT_UNITS[number];
export type FoodItem = typeof foodItems.$inferSelect;
export type InsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
