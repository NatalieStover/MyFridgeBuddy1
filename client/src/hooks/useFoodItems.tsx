import { useQuery, useMutation } from "@tanstack/react-query";
import { FoodItem, InsertFoodItem, FoodCategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, parseISO } from "date-fns";

// Get all food items
export function useFoodItems() {
  return useQuery<FoodItem[]>({
    queryKey: ["/api/food-items"],
  });
}

// Get food items by category
export function useFoodItemsByCategory(category: FoodCategory) {
  return useQuery<FoodItem[]>({
    queryKey: ["/api/food-items/category", category],
    queryFn: async () => {
      const response = await fetch(`/api/food-items/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch category items');
      return response.json();
    },
    enabled: !!category && category !== "all",
  });
}

// Get expiring food items
export function useExpiringFoodItems(days: number = 3) {
  return useQuery<FoodItem[]>({
    queryKey: ["/api/food-items/expiring", days],
  });
}

// Add a new food item
export function useAddFoodItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (foodItem: InsertFoodItem) => {
      const res = await apiRequest("POST", "/api/food-items", foodItem);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      toast({
        title: "Success!",
        description: "Item added to your fridge.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add item",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
}

// Update a food item
export function useUpdateFoodItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertFoodItem> }) => {
      const res = await apiRequest("PATCH", `/api/food-items/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      toast({
        title: "Success!",
        description: "Item updated.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update item",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
}

// Delete a food item
export function useDeleteFoodItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/food-items/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/food-items"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your fridge.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete item",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });
}

// Helper function to get expiration status and text
export function getExpirationInfo(expirationDate: Date | string) {
  const dateObj = typeof expirationDate === 'string' ? parseISO(expirationDate) : expirationDate;
  const daysUntilExpiration = differenceInDays(dateObj, new Date());
  
  let statusColor = "success";
  let expirationText = "";
  
  if (daysUntilExpiration < 0) {
    statusColor = "destructive";
    expirationText = "Expired";
  } else if (daysUntilExpiration === 0) {
    statusColor = "destructive";
    expirationText = "Expires today";
  } else if (daysUntilExpiration <= 2) {
    statusColor = "warning";
    expirationText = `${daysUntilExpiration} day${daysUntilExpiration !== 1 ? 's' : ''} left`;
  } else {
    statusColor = "success";
    expirationText = `${daysUntilExpiration} days left`;
  }
  
  return { statusColor, expirationText, daysUntilExpiration };
}
