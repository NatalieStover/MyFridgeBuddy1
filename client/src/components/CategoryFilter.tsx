import { FoodCategory, FOOD_CATEGORIES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Milk, Apple, Beef, Wheat, Banana, CupSoda, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: FoodCategory | "all";
  onSelectCategory: (category: FoodCategory | "all") => void;
}

// Map of icons for each category
const categoryIcons = {
  all: LayoutGrid,
  dairy: Milk,
  vegetables: Banana,
  fruits: Apple,
  meats: Beef,
  grains: Wheat,
  beverages: CupSoda,
  other: LayoutGrid
};

// Map of display names for each category
const categoryDisplayNames = {
  all: "All",
  dairy: "Dairy",
  vegetables: "Veggies",
  fruits: "Fruits",
  meats: "Meats",
  grains: "Grains",
  beverages: "Drinks",
  other: "Other"
};

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <section className="mb-8">
      <h2 className="font-nunito font-bold text-xl mb-4">Categories</h2>
      <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryButton 
          category="all"
          isSelected={selectedCategory === "all"}
          onClick={() => onSelectCategory("all")}
        />
        
        {FOOD_CATEGORIES.map((category) => (
          <CategoryButton 
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </section>
  );
}

interface CategoryButtonProps {
  category: FoodCategory | "all";
  isSelected: boolean;
  onClick: () => void;
}

function CategoryButton({ category, isSelected, onClick }: CategoryButtonProps) {
  const Icon = categoryIcons[category] || LayoutGrid;
  
  return (
    <button 
      onClick={onClick}
      className={`category-badge flex flex-col items-center p-3 rounded-lg shadow-md min-w-[80px] ${
        isSelected 
          ? "bg-primary text-white" 
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs font-medium">{categoryDisplayNames[category]}</span>
    </button>
  );
}
