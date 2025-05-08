import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFoodItemSchema, FOOD_CATEGORIES, MEASUREMENT_UNITS, type InsertFoodItem } from "@shared/schema";
import { useAddFoodItem } from "@/hooks/useFoodItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";
import { format } from "date-fns";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddItemDialog({ open, onOpenChange }: AddItemDialogProps) {
  const { mutate: addFoodItem, isPending } = useAddFoodItem();
  const [showCustomUnit, setShowCustomUnit] = useState(false);
  
  // Initialize form with default values
  const form = useForm<InsertFoodItem>({
    resolver: zodResolver(insertFoodItemSchema),
    defaultValues: {
      name: "",
      category: "other",
      quantity: 1,
      unit: "pcs",
      expirationDate: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    },
  });
  
  const onSubmit = (data: InsertFoodItem) => {
    addFoodItem(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        setShowCustomUnit(false);
      }
    });
  };
  
  // Handle unit selection, show custom unit input if "custom" is selected
  const handleUnitChange = (value: string) => {
    form.setValue("unit", value as any);
    setShowCustomUnit(value === "custom");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <div className="bg-secondary p-4 -m-6 mb-4 rounded-t-lg text-secondary-foreground flex justify-between items-center">
            <DialogTitle className="font-nunito font-extrabold text-lg text-secondary-foreground">Add New Item</DialogTitle>
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
            {/* Name field */}
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
            
            {/* Category field */}
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
                      <SelectContent className="bg-background border-[#E8E4E1]">
                        {FOOD_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category} className="font-medium">
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
            
            {/* Quantity and Unit fields */}
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
                        <SelectContent className="bg-background border-[#E8E4E1]">
                          {MEASUREMENT_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit} className="font-medium">
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
            
            {/* Custom Unit field (conditionally rendered) */}
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
            
            {/* Expiration Date field */}
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-foreground">Expiration Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      className="bg-[#E8E4E1]/50 border-[#E8E4E1] focus-visible:ring-primary"
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Notes field */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-foreground">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional details..."
                      className="resize-none bg-[#E8E4E1]/50 border-[#E8E4E1] focus-visible:ring-primary"
                      rows={2}
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="font-bold border-[#E8E4E1] hover:bg-[#E8E4E1]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
              >
                {isPending ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
