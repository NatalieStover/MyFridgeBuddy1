import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  onAddItem: () => void;
}

export default function EmptyState({ onAddItem }: EmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="font-nunito font-bold text-xl mb-2 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Your fridge is empty!
      </motion.h2>
      
      <motion.p 
        className="text-gray-500 mb-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Looks like it's time to go shopping! Add items to keep track of what's in your fridge.
      </motion.p>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: [10, -10, 0], opacity: 1 }}
        transition={{ 
          delay: 0.6, 
          duration: 0.8,
          y: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 1.5,
            ease: "easeInOut"
          }
        }}
      >
        <Button 
          onClick={onAddItem}
          className="bg-[#FFAC94] text-[#554B48] py-3 px-6 rounded-full shadow-md hover:shadow-lg transition flex items-center space-x-2 border-[#ffc4b0] hover:bg-[#ffc4b0]"
        >
          <Plus className="h-5 w-5" />
          <span>Add Your First Item</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
