import { useQuery, useMutation } from "@tanstack/react-query";
import { InsertShoppingListItem, ShoppingListItem } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { localStorageClient } from "@/lib/localStorageClient";
import { useToast } from "@/hooks/use-toast";

// Get all shopping list items
export function useShoppingList() {
  return useQuery<ShoppingListItem[]>({
    queryKey: ["/api/shopping-list"],
    queryFn: () => localStorageClient.getShoppingList(),
  });
}

// Add a new shopping list item
export function useAddShoppingListItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (item: InsertShoppingListItem) => {
      return localStorageClient.addToShoppingList(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
      toast({
        title: "Success!",
        description: "Item added to your shopping list.",
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

// Update a shopping list item
export function useUpdateShoppingListItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<ShoppingListItem> }) => {
      return localStorageClient.updateShoppingListItem(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
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

// Delete a shopping list item
export function useDeleteShoppingListItem() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => {
      const success = localStorageClient.deleteShoppingListItem(id);
      if (!success) throw new Error('Item not found');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your shopping list.",
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

// Toggle a shopping list item's completed status
export function useToggleShoppingListItem() {
  return useMutation({
    mutationFn: (id: number) => {
      return localStorageClient.toggleShoppingListItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
    },
  });
}

// Clear completed items
export function useClearCompletedItems() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: () => {
      localStorageClient.clearCompletedItems();
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
      toast({
        title: "Success",
        description: "Completed items have been cleared.",
        variant: "success",
      });
    },
  });
}