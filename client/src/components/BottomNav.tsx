import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BottomNavProps {
  onAddItem: () => void;
}

export default function BottomNav({ onAddItem }: BottomNavProps) {
  return (
    <nav className="bg-background shadow-lg rounded-t-xl fixed bottom-0 left-0 right-0 z-10 md:hidden">
      <div className="flex justify-center items-center py-3 px-4">
        <Button 
          onClick={onAddItem}
          className="flex flex-col items-center bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}