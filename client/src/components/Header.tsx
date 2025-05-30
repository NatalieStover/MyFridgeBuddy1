import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Refrigerator, Search, Plus } from "lucide-react";
import { NotificationsDialog } from "./NotificationsDialog";

interface HeaderProps {
  onAddItem: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ onAddItem, searchQuery, onSearchChange }: HeaderProps) {

  return (
    <header className="bg-background shadow-sm py-3 px-4 sm:px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Refrigerator className="text-[#554B47] h-6 w-6" />
          <h1 className="font-nunito font-extrabold text-2xl text-[#554B47]">My Fridge Buddy</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationsDialog />
          <div className="bg-[#E8E4E1] rounded-full p-1 hidden sm:flex items-center w-40 lg:w-60">
            <Input
              type="text"
              placeholder="Search foods..."
              className="bg-transparent border-none outline-none px-3 py-1 text-sm font-medium"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="text-foreground/70 h-4 w-4" />
          </div>
          <Button 
            onClick={onAddItem}
            size="icon" 
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
