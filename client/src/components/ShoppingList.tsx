import { useState } from 'react';
import { useShoppingList, useToggleShoppingListItem, useDeleteShoppingListItem, useClearCompletedItems } from '@/hooks/useShoppingList';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import AddShoppingItemDialog from '@/components/AddShoppingItemDialog';
import { ShoppingListItem } from '@shared/schema';

export default function ShoppingList() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { data: items = [], isLoading } = useShoppingList();
  const { mutate: toggleItem } = useToggleShoppingListItem();
  const { mutate: deleteItem } = useDeleteShoppingListItem();
  const { mutate: clearCompleted } = useClearCompletedItems();

  const activeItems = items.filter(item => !item.completed);
  const completedItems = items.filter(item => item.completed);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-nunito font-bold text-xl">Shopping List</h2>
        <Button
          onClick={() => setIsAddItemOpen(true)}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {/* Active Items */}
        <div className="space-y-2">
          {activeItems.map((item) => (
            <ShoppingListItemRow
              key={item.id}
              item={item}
              onToggle={() => toggleItem(item.id)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>

        {/* Completed Items */}
        {completedItems.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Completed ({completedItems.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearCompleted()}
                className="text-xs"
              >
                Clear completed
              </Button>
            </div>
            <div className="space-y-2">
              {completedItems.map((item) => (
                <ShoppingListItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Your shopping list is empty
          </div>
        )}
      </div>

      <AddShoppingItemDialog
        open={isAddItemOpen}
        onOpenChange={setIsAddItemOpen}
      />
    </div>
  );
}

interface ShoppingListItemRowProps {
  item: ShoppingListItem;
  onToggle: () => void;
  onDelete: () => void;
}

function ShoppingListItemRow({ item, onToggle, onDelete }: ShoppingListItemRowProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg bg-card border ${
      item.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-center space-x-3">
        <Checkbox
          checked={item.completed}
          onCheckedChange={onToggle}
        />
        <div className={`space-y-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">
            {item.quantity} {item.customUnit || item.unit} · {item.category}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}