import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ExpiringItems from "@/components/ExpiringItems";
import AllItems from "@/components/AllItems";
import BottomNav from "@/components/BottomNav";
import AddItemDialog from "@/components/AddItemDialog";
import EmptyState from "@/components/EmptyState";
import { useFoodItems } from "@/hooks/useFoodItems";
import { FoodCategory, FoodItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "all">("all");
  const [sortOrder, setSortOrder] = useState<"recently-added" | "expiration-date" | "name">("expiration-date");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  
  const { data: foodItems, isLoading, error } = useFoodItems();
  const { toast } = useToast();
  
  // Function to handle opening the edit dialog
  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setIsAddItemOpen(true);
  };
  
  // Function to handle closing the dialog
  const handleDialogClose = (open: boolean) => {
    setIsAddItemOpen(open);
    if (!open) {
      // Reset the editing item when dialog closes
      setEditingItem(null);
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load your fridge items. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Check for notifications
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) throw new Error("Failed to fetch notifications");
        
        const notifications = await response.json();
        
        if (notifications.length > 0) {
          const itemNames = notifications.map((item: any) => item.name).join(", ");
          toast({
            title: "Items Expiring Soon!",
            description: `These items are about to expire: ${itemNames}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };
    
    checkNotifications();
    
    // Check for notifications every hour
    const notificationInterval = setInterval(checkNotifications, 60 * 60 * 1000);
    
    return () => clearInterval(notificationInterval);
  }, [toast]);

  const filteredItems = foodItems || [];
  const isEmpty = !isLoading && (!foodItems || foodItems.length === 0);

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header 
        onAddItem={() => {
          setEditingItem(null);
          setIsAddItemOpen(true);
        }} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-grow py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {isEmpty ? (
            <EmptyState onAddItem={() => {
              setEditingItem(null);
              setIsAddItemOpen(true);
            }} />
          ) : (
            <>
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
              
              <ExpiringItems isLoading={isLoading} />
              
              <AllItems 
                selectedCategory={selectedCategory}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                searchQuery={searchQuery}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </main>
      
      <BottomNav onAddItem={() => {
          setEditingItem(null);
          setIsAddItemOpen(true);
        }} />
      
      <AddItemDialog 
        open={isAddItemOpen} 
        onOpenChange={handleDialogClose} 
        editItem={editingItem}
      />
    </div>
  );
}
