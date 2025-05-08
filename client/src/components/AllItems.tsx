import { useFoodItems, useFoodItemsByCategory } from "@/hooks/useFoodItems";
import FoodItem from "@/components/FoodItem";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FoodCategory, FoodItem as FoodItemType } from "@shared/schema";
import { differenceInDays, parseISO } from "date-fns";
import { useMemo } from "react";

interface AllItemsProps {
  selectedCategory: FoodCategory | "all";
  sortOrder: "recently-added" | "expiration-date" | "name";
  onSortOrderChange: (order: "recently-added" | "expiration-date" | "name") => void;
  searchQuery: string;
  isLoading: boolean;
  onEditItem?: (item: FoodItemType) => void;
}

export default function AllItems({
  selectedCategory,
  sortOrder,
  onSortOrderChange,
  searchQuery,
  isLoading,
  onEditItem
}: AllItemsProps) {
  const { data: allItems } = useFoodItems();
  const { data: categoryItems } = useFoodItemsByCategory(selectedCategory as FoodCategory);
  
  const items = selectedCategory === "all" ? allItems : categoryItems;
  
  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];
    
    // Filter by search query
    let filtered = items;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Sort items
    return [...filtered].sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "recently-added") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        // expiration-date
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        return dateA.getTime() - dateB.getTime();
      }
    });
  }, [items, searchQuery, sortOrder]);
  
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-bold text-xl">All Items</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-added">Recently Added</SelectItem>
              <SelectItem value="expiration-date">Expiration Date</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          // Skeletons for loading state
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="flex p-3">
                <div className="w-1/3 pr-2">
                  <Skeleton className="rounded-lg w-full h-20" />
                </div>
                <div className="w-2/3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-20 mb-1" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-16 mb-2" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item) => (
            <FoodItem 
              key={item.id} 
              item={item}
              displayStyle="compact"
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No items found. Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
