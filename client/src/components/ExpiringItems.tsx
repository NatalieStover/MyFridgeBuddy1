import { useExpiringFoodItems, getExpirationInfo } from "@/hooks/useFoodItems";
import FoodItem from "@/components/FoodItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ExpiringItemsProps {
  isLoading: boolean;
}

export default function ExpiringItems({ isLoading }: ExpiringItemsProps) {
  const { data: expiringItems } = useExpiringFoodItems(3);
  
  // Only show this section if there are expiring items
  if (!isLoading && (!expiringItems || expiringItems.length === 0)) {
    return null;
  }
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-nunito font-bold text-xl">Expiring Soon</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Skeletons for loading state
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          expiringItems?.slice(0, 3).map((item) => (
            <FoodItem 
              key={item.id} 
              item={item}
              displayStyle="large"
            />
          ))
        )}
      </div>
    </section>
  );
}
