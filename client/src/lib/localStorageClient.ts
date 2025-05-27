import { FoodItem, InsertFoodItem, ShoppingListItem, InsertShoppingListItem } from "@shared/schema";

class LocalStorageClient {
  private readonly STORAGE_KEY = 'food_items';
  private readonly SHOPPING_LIST_KEY = 'shopping_list';
  private currentId = 1;
  private shoppingListId = 1;

  constructor() {
    const items = this.getAllFoodItems();
    if (items.length > 0) {
      this.currentId = Math.max(...items.map(item => item.id)) + 1;
    }

    const shoppingItems = this.getShoppingList();
    if (shoppingItems.length > 0) {
      this.shoppingListId = Math.max(...shoppingItems.map(item => item.id)) + 1;
    }
  }

  // Food Items Methods
  getAllFoodItems(): FoodItem[] {
    const items = localStorage.getItem(this.STORAGE_KEY);
    return items ? JSON.parse(items) : [];
  }

  getFoodItemById(id: number): FoodItem | undefined {
    return this.getAllFoodItems().find(item => item.id === id);
  }

  getFoodItemsByCategory(category: string): FoodItem[] {
    return this.getAllFoodItems().filter(item => item.category === category);
  }

  getExpiringFoodItems(days: number): FoodItem[] {
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + days);
    
    return this.getAllFoodItems().filter(item => {
      const expirationDate = new Date(item.expirationDate);
      return expirationDate <= threshold && expirationDate >= today;
    });
  }

  createFoodItem(foodItem: InsertFoodItem): FoodItem {
    const items = this.getAllFoodItems();
    const newItem: FoodItem = {
      ...foodItem,
      id: this.currentId++,
      createdAt: new Date(),
      notified: false
    };
    
    items.push(newItem);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return newItem;
  }

  updateFoodItem(id: number, updates: Partial<InsertFoodItem>): FoodItem | undefined {
    const items = this.getAllFoodItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return undefined;
    
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    return updatedItem;
  }

  deleteFoodItem(id: number): boolean {
    const items = this.getAllFoodItems();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredItems));
    return items.length !== filteredItems.length;
  }

  markAsNotified(id: number): void {
    const items = this.getAllFoodItems();
    const item = items.find(item => item.id === id);
    if (item) {
      item.notified = true;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  // Shopping List Methods
  getShoppingList(): ShoppingListItem[] {
    const items = localStorage.getItem(this.SHOPPING_LIST_KEY);
    return items ? JSON.parse(items) : [];
  }

  addToShoppingList(item: InsertShoppingListItem): ShoppingListItem {
    const items = this.getShoppingList();
    const newItem: ShoppingListItem = {
      ...item,
      id: this.shoppingListId++,
      completed: false,
      createdAt: new Date()
    };
    
    items.push(newItem);
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(items));
    return newItem;
  }

  updateShoppingListItem(id: number, updates: Partial<ShoppingListItem>): ShoppingListItem | undefined {
    const items = this.getShoppingList();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return undefined;
    
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(items));
    return updatedItem;
  }

  deleteShoppingListItem(id: number): boolean {
    const items = this.getShoppingList();
    const filteredItems = items.filter(item => item.id !== id);
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(filteredItems));
    return items.length !== filteredItems.length;
  }

  toggleShoppingListItem(id: number): ShoppingListItem | undefined {
    const items = this.getShoppingList();
    const item = items.find(item => item.id === id);
    
    if (!item) return undefined;
    
    item.completed = !item.completed;
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(items));
    return item;
  }

  clearCompletedItems(): void {
    const items = this.getShoppingList();
    const activeItems = items.filter(item => !item.completed);
    localStorage.setItem(this.SHOPPING_LIST_KEY, JSON.stringify(activeItems));
  }
}

export const localStorageClient = new LocalStorageClient();