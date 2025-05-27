import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertShoppingListItemSchema, FOOD_CATEGORIES, MEASUREMENT_UNITS, type InsertShoppingListItem } from "@shared/schema";
import { useAddShoppingListItem } from "@/hooks/useShoppingList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";

interface AddShoppingItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddShoppingItemDialog({ open, onOpenChange }: AddShoppingItemDialogProps) {
  const { mutate: addShoppingItem, isPending } = useAddShoppingListItem();
  const [showCustomUnit, setShowCustomUnit] = useState(false);

  const form = useForm<InsertShoppingListItem>({
    resolver: zodResolver(insertShoppingListItemSchema),
    defaultValues: {
      name: "",
      category: "other",
      quantity: 1,
      unit: "pcs",
    },
  });

  const onSubmit = (data: InsertShoppingListItem) => {
    addShoppingItem(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        setShowCustomUnit(false);
      }
    });
  };

  const handleUnitChange = (value: string) => {
    form.setValue("unit", value as any);
    setShowCustomUnit(value === "custom");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background" hasCloseButton={false}>
        <DialogHeader>
          <div className="bg-secondary p-4 -m-6 mb-4 rounded-t-lg text-secondary-foreground flex justify-between items-center">
            <DialogTitle className="font-nunito font-extrabold text-lg text-secondary-foreground">
              Add to Shopping List
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-secondary-foreground hover:bg-secondary-foreground/20 rounded-full" 
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-foreground">Item Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Milk, Eggs, Apples..." 
                      className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus-visible:ring-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-foreground">Category</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus:ring-primary">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {FOOD_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="font-bold text-foreground">Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0.1" 
                        step="0.1"
                        className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus-visible:ring-primary"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="font-bold text-foreground">Unit</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={handleUnitChange}
                      >
                        <SelectTrigger className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus:ring-primary">
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {MEASUREMENT_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showCustomUnit && (
              <FormField
                control={form.control}
                name="customUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-foreground">Custom Unit</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. slice, bunch, etc." 
                        className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus-visible:ring-primary"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-2">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold w-full"
              >
                {isPending ? "Adding..." : "Add to Shopping List"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}