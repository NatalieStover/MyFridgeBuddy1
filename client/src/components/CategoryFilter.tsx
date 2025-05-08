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
      <h2 className="font-nunito font-extrabold text-xl mb-4">Categories</h2>
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
  
  // Choose background color class based on category
  const getCategoryBgClass = (cat: FoodCategory | "all") => {
    switch (cat) {
      case "all": return "bg-[#E8E4E1]";
      case "dairy": return "bg-[#F3E5D1]"; // vanilla cream
      case "vegetables": return "bg-[#CCD8BF]"; // sage green
      case "fruits": return "bg-[#FFEAD0]"; // peach color
      case "meats": return "bg-[#FFD8CC]"; // sunset red pastel
      case "grains": return "bg-[#EAD9BF]"; // rustic oak pastel brown
      case "beverages": return "bg-[#E0D8EF]"; // lavender
      default: return "bg-[#E8E4E1]";
    }
  };
  
  // Base classes always applied
  const baseClasses = "category-badge flex flex-col items-center p-3 rounded-lg shadow-md min-w-[80px]";
  
  // Classes applied when selected or unselected
  const stateClasses = isSelected
    ? "bg-primary text-primary-foreground"
    : `${getCategoryBgClass(category)} text-foreground hover:bg-opacity-90`;
  
  // Icon classes based on selected state
  const iconClasses = isSelected
    ? "h-5 w-5 mb-1 text-primary-foreground"
    : "h-5 w-5 mb-1 text-[#554B47]";
    
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      <Icon className={iconClasses} />
      <span className="text-xs font-extrabold">{categoryDisplayNames[category]}</span>
    </button>
  );
}
