import { useState } from "react";
import { FoodItem as FoodItemType } from "@shared/schema";
import { getExpirationInfo, useDeleteFoodItem, useUpdateFoodItem } from "@/hooks/useFoodItems";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatRelative } from "date-fns";
import { Milk, Apple, Sprout, Beef, Wheat, CupSoda, Package, MoreVertical, Trash, Edit, Minus, Plus } from "lucide-react";

interface FoodItemProps {
  item: FoodItemType;
  displayStyle: 'large' | 'compact';
}

// Category icons and colors
const categoryConfig = {
  dairy: { icon: Milk, bgColor: "bg-blue-100", textColor: "text-blue-600" },
  vegetables: { icon: Sprout, bgColor: "bg-green-100", textColor: "text-green-600" },
  fruits: { icon: Apple, bgColor: "bg-purple-100", textColor: "text-purple-600" },
  meats: { icon: Beef, bgColor: "bg-red-100", textColor: "text-red-600" },
  grains: { icon: Wheat, bgColor: "bg-yellow-100", textColor: "text-yellow-600" },
  beverages: { icon: CupSoda, bgColor: "bg-teal-100", textColor: "text-teal-600" },
  other: { icon: Package, bgColor: "bg-gray-100", textColor: "text-gray-600" },
};

// Background colors for categories in badge format
const categoryBadgeColors = {
  dairy: "bg-blue-100 text-blue-600",
  vegetables: "bg-green-100 text-green-600",
  fruits: "bg-purple-100 text-purple-600",
  meats: "bg-red-100 text-red-600",
  grains: "bg-yellow-100 text-yellow-600",
  beverages: "bg-teal-100 text-teal-600",
  other: "bg-gray-100 text-gray-600",
};

export default function FoodItem({ item, displayStyle }: FoodItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { mutate: updateFoodItem } = useUpdateFoodItem();
  const { mutate: deleteFoodItem } = useDeleteFoodItem();
  
  const { expirationText, statusColor, daysUntilExpiration } = getExpirationInfo(item.expirationDate);
  
  const handleDelete = () => {
    deleteFoodItem(item.id);
    setIsDeleteDialogOpen(false);
  };
  
  const incrementQuantity = () => {
    updateFoodItem({
      id: item.id,
      updates: { quantity: item.quantity + 1 }
    });
  };
  
  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateFoodItem({
        id: item.id,
        updates: { quantity: item.quantity - 1 }
      });
    }
  };
  
  // Get the category styling
  const categoryStyle = categoryConfig[item.category] || categoryConfig.other;
  const CategoryIcon = categoryStyle.icon;
  
  // Get status color class for the expiration badge
  const statusColorClass = {
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    destructive: "bg-danger/20 text-danger",
  }[statusColor];
  
  // Format for expiration badge in large display
  const expirationBadgeClass = {
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    destructive: "bg-danger text-white",
  }[statusColor];
  
  // Determine unit display
  const unitDisplay = item.customUnit || item.unit;
  
  if (displayStyle === 'large') {
    return (
      <div className="food-card bg-white rounded-xl shadow-md overflow-hidden">
        <div className="relative">
          <div className={`${categoryStyle.bgColor} w-full h-40 flex items-center justify-center`}>
            <CategoryIcon className={`${categoryStyle.textColor} h-20 w-20`} />
          </div>
          <span className={`absolute top-2 right-2 ${expirationBadgeClass} text-xs font-bold px-2 py-1 rounded-full`}>{expirationText}</span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-nunito font-bold text-lg">{item.name}</h3>
            <span className={`${categoryBadgeColors[item.category]} text-xs font-medium px-2 py-1 rounded-full`}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-100 hover:bg-gray-200 border-gray-100 h-8 w-8 rounded-full" 
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </Button>
              <span className="font-medium">{item.quantity} {unitDisplay}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-100 hover:bg-gray-200 border-gray-100 h-8 w-8 rounded-full" 
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {item.notes && (
            <div className="mt-2 text-xs text-gray-500">{item.notes}</div>
          )}
        </div>
        
        <DeleteConfirmationDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={item.name}
        />
      </div>
    );
  }
  
  // Compact display
  return (
    <div className="food-card bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex p-3">
        <div className="w-1/3 pr-2">
          <div className={`${categoryStyle.bgColor} rounded-lg w-full h-full flex items-center justify-center`}>
            <CategoryIcon className={`${categoryStyle.textColor} h-6 w-6`} />
          </div>
        </div>
        <div className="w-2/3">
          <div className="flex justify-between items-start">
            <h3 className="font-nunito font-medium">{item.name}</h3>
            <span className={`${statusColorClass} text-xs px-1.5 py-0.5 rounded-full`}>{expirationText}</span>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-100 hover:bg-gray-200 border-gray-100 h-6 w-6 rounded-full p-0" 
                onClick={decrementQuantity}
              >
                <Minus className="h-3 w-3 text-gray-600" />
              </Button>
              <span className="text-sm font-medium">{item.quantity} {unitDisplay}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-gray-100 hover:bg-gray-200 border-gray-100 h-6 w-6 rounded-full p-0" 
                onClick={incrementQuantity}
              >
                <Plus className="h-3 w-3 text-gray-600" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={item.name}
      />
    </div>
  );
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName: string;
}

function DeleteConfirmationDialog({ open, onOpenChange, onConfirm, itemName }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemName}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove the item from your fridge.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
