import { Button } from "@/components/ui/button";
import { Home, Search, Plus, Bell, Settings } from "lucide-react";

interface BottomNavProps {
  onAddItem: () => void;
}

export default function BottomNav({ onAddItem }: BottomNavProps) {
  return (
    <nav className="bg-white shadow-lg rounded-t-xl fixed bottom-0 left-0 right-0 z-10 md:hidden">
      <div className="flex justify-around items-center py-3 px-4">
        <Button variant="ghost" className="flex flex-col items-center text-primary">
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-gray-500">
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
        </Button>
        
        <Button 
          onClick={onAddItem}
          className="flex flex-col items-center bg-accent text-white p-3 rounded-full shadow-lg -mt-6"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-gray-500">
          <Bell className="h-5 w-5" />
          <span className="text-xs mt-1">Alerts</span>
        </Button>
        
        <Button variant="ghost" className="flex flex-col items-center text-gray-500">
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Button>
      </div>
    </nav>
  );
}
