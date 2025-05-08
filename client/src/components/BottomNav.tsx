import { Button } from "@/components/ui/button";
import { Home, Search, Plus, Bell, Settings } from "lucide-react";

interface BottomNavProps {
  onAddItem: () => void;
}

export default function BottomNav({ onAddItem }: BottomNavProps) {
  return (
    <nav className="bg-background shadow-lg rounded-t-xl fixed bottom-0 left-0 right-0 z-10 md:hidden">
      <div className="flex justify-around items-center py-3 px-4">
        <Button variant="ghost" className="flex flex-col items-center text-primary">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1 font-extrabold">Home</span>
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-foreground/70 hover:text-foreground">
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1 font-extrabold">Search</span>
        </Button>
        
        <Button 
          onClick={onAddItem}
          className="flex flex-col items-center bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg -mt-6"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-foreground/70 hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="text-xs mt-1 font-extrabold">Alerts</span>
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-foreground/70 hover:text-foreground">
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1 font-extrabold">Settings</span>
        </Button>
      </div>
    </nav>
  );
}
