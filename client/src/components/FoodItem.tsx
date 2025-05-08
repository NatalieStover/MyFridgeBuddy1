import { useState } from "react";
import { FoodItem as FoodItemType } from "@shared/schema";
import { getExpirationInfo, useDeleteFoodItem, useUpdateFoodItem } from "@/hooks/useFoodItems";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Milk, Apple, Sprout, Beef, Wheat, CupSoda, Package, Trash, Edit, Minus, Plus } from "lucide-react";

interface FoodItemProps {
  item: FoodItemType;
  displayStyle: 'large' | 'compact';
  onEdit?: (item: FoodItemType) => void;
}

// Category icons and colors with warmer pastels
const categoryConfig = {
  dairy: { icon: Milk, bgColor: "bg-[#F3E5D1]", textColor: "text-[#AA8362]" }, // vanilla cream
  vegetables: { icon: Sprout, bgColor: "bg-[#CCD8BF]", textColor: "text-[#5C6D4A]" }, // sage green
  fruits: { icon: Apple, bgColor: "bg-[#FFEAD0]", textColor: "text-[#D9936A]" }, // peach color
  meats: { icon: Beef, bgColor: "bg-[#FFD8CC]", textColor: "text-[#D96D55]" }, // sunset red pastel
  grains: { icon: Wheat, bgColor: "bg-[#EAD9BF]", textColor: "text-[#A67C52]" }, // rustic oak pastel brown
  beverages: { icon: CupSoda, bgColor: "bg-[#E0D8EF]", textColor: "text-[#8A7AAF]" }, // lavender
  other: { icon: Package, bgColor: "bg-[#E8E4E1]", textColor: "text-[#554B47]" },
};

// Background colors for categories in badge format with warmer pastels
const categoryBadgeColors = {
  dairy: "bg-[#F3E5D1] text-[#AA8362]", // vanilla cream
  vegetables: "bg-[#CCD8BF] text-[#5C6D4A]", // sage green
  fruits: "bg-[#FFEAD0] text-[#D9936A]", // peach color
  meats: "bg-[#FFD8CC] text-[#D96D55]", // sunset red pastel
  grains: "bg-[#EAD9BF] text-[#A67C52]", // rustic oak pastel brown
  beverages: "bg-[#E0D8EF] text-[#8A7AAF]", // lavender
  other: "bg-[#E8E4E1] text-[#554B47]",
};

export default function FoodItem({ item, displayStyle, onEdit }: FoodItemProps) {
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
  
  // Get status color class for the expiration badge with warmer pastels
  const statusColorClass = {
    success: "bg-[#CCD8BF] text-[#5C6D4A]", // sage green for good
    warning: "bg-[#FFEAD0] text-[#D9936A]", // peach for warning
    destructive: "bg-[#FFD8CC] text-[#D96D55]", // sunset red for expired
  }[statusColor];
  
  // Format for expiration badge in large display with warmer pastels
  const expirationBadgeClass = {
    success: "bg-[#CCD8BF] text-[#5C6D4A]", // sage green for good
    warning: "bg-[#FFEAD0] text-[#D9936A]", // peach for warning
    destructive: "bg-[#FFD8CC] text-[#D96D55]", // sunset red for expired
  }[statusColor];
  
  // Determine unit display
  const unitDisplay = item.customUnit || item.unit;
  
  if (displayStyle === 'large') {
    return (
      <div className="food-card bg-background rounded-xl shadow-md overflow-hidden relative">
        <div className="relative">
          <div className={`${categoryStyle.bgColor} w-full h-40 flex items-center justify-center`}>
            <CategoryIcon className={`${categoryStyle.textColor} h-20 w-20`} />
          </div>
          <span className={`absolute top-2 right-2 ${expirationBadgeClass} text-xs font-extrabold px-2 py-1 rounded-full`}>{expirationText}</span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-nunito text-lg font-extrabold">{item.name}</h3>
            <span className={`${categoryBadgeColors[item.category]} text-xs px-2 py-1 rounded-full font-bold`}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-[#E8E4E1] hover:bg-[#DCD9D5] border-[#E8E4E1] h-8 w-8 rounded-full" 
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4 text-foreground" />
              </Button>
              <span className="font-bold">{item.quantity} {unitDisplay}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-[#E8E4E1] hover:bg-[#DCD9D5] border-[#E8E4E1] h-8 w-8 rounded-full" 
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </div>
          {item.notes && (
            <div className="mt-2 text-xs text-foreground/80">{item.notes}</div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 p-0"
            onClick={() => onEdit && onEdit(item)}
          >
            <Edit className="h-4 w-4 text-[#554B47]" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-full shadow-sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
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
    <div className="food-card bg-background rounded-xl shadow-md overflow-hidden relative">
      <div className="flex p-3">
        <div className="w-1/3 pr-2">
          <div className={`${categoryStyle.bgColor} rounded-lg w-full h-full flex items-center justify-center`}>
            <CategoryIcon className={`${categoryStyle.textColor} h-6 w-6`} />
          </div>
        </div>
        <div className="w-2/3">
          <div className="flex justify-between items-start">
            <h3 className="font-nunito font-extrabold">{item.name}</h3>
            <span className={`${statusColorClass} text-xs px-1.5 py-0.5 rounded-full font-bold`}>{expirationText}</span>
          </div>
          <p className="text-xs text-foreground/70 mb-2">
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </p>
          <div className="flex items-center space-x-1 mt-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-[#E8E4E1] hover:bg-[#DCD9D5] border-[#E8E4E1] h-6 w-6 rounded-full p-0" 
              onClick={decrementQuantity}
            >
              <Minus className="h-3 w-3 text-foreground" />
            </Button>
            <span className="text-sm font-bold">{item.quantity} {unitDisplay}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-[#E8E4E1] hover:bg-[#DCD9D5] border-[#E8E4E1] h-6 w-6 rounded-full p-0" 
              onClick={incrementQuantity}
            >
              <Plus className="h-3 w-3 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 p-0"
          onClick={() => onEdit && onEdit(item)}
        >
          <Edit className="h-3 w-3 text-[#554B47]" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="h-6 w-6 rounded-full shadow-sm p-0"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash className="h-3 w-3" />
        </Button>
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
