
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  expirationDate: string;
}

export function NotificationsDialog() {
  const [open, setOpen] = useState(false);
  
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        className="relative"
      >
        <Bell className="text-foreground h-5 w-5" />
        {notifications.length > 0 && (
          <span className="notification-dot absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full"></span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expiring Items</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground">No items expiring soon</p>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">
                    Expires {format(new Date(item.expirationDate), 'MMM d')}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
