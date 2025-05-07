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
      {/* Empty fridge SVG illustration */}
      <svg 
        className="w-64 h-auto mb-6"
        viewBox="0 0 400 300" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="100" y="30" width="200" height="240" rx="10" fill="#F2F2F2" />
        <rect x="100" y="30" width="200" height="120" rx="10" fill="#E6E6E6" />
        <rect x="100" y="150" width="200" height="120" rx="10" fill="#F8F8F8" />
        <rect x="100" y="149" width="200" height="2" fill="#DEDEDE" />
        <rect x="130" y="50" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="70" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="90" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="110" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="170" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="190" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="210" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="130" y="230" width="140" height="2" rx="1" fill="#DEDEDE" />
        <rect x="110" y="140" width="10" height="20" rx="2" fill="#DEDEDE" />
        <rect x="110" y="260" width="10" height="20" rx="2" fill="#DEDEDE" />
        <circle cx="215" cy="130" r="15" fill="#FFD6D6" />
        <circle cx="215" cy="130" r="10" fill="#FF9AA2" />
        <circle cx="215" cy="250" r="15" fill="#D6FFE1" />
        <circle cx="215" cy="250" r="10" fill="#B5EAD7" />
      </svg>
      
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
        Looks like it's time to go shopping. Add items to keep track of what's in your fridge.
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
          className="bg-primary text-white py-3 px-6 rounded-full shadow-md hover:shadow-lg transition flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Your First Item</span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
