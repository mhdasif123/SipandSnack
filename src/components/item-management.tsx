"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { Item } from "@/lib/data";
import { itemSchema } from "@/lib/schemas";
import { addItemAction, updateItemAction, deleteItemAction } from "@/lib/actions";

type ItemManagementProps = {
  initialItems: Item[];
  itemType: 'tea' | 'snack';
  itemTypePlural: 'tea' | 'snacks';
};

export function ItemManagement({ initialItems, itemType, itemTypePlural }: ItemManagementProps) {
  const [items, setItems] = useState(initialItems);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", price: 0 },
  });

  const handleDialogOpen = (item: Item | null) => {
    setEditingItem(item);
    form.reset({ name: item?.name || "", price: item?.price || 0 });
    setDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof itemSchema>) => {
    startTransition(async () => {
      if (editingItem) {
        await updateItemAction(itemType, editingItem.id, data);
        setItems(items.map(i => i.id === editingItem.id ? { ...i, ...data } : i));
      } else {
        await addItemAction(itemType, data);
        setItems([...items, { id: Date.now().toString(), ...data }]);
      }
      setDialogOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
        await deleteItemAction(itemType, id);
        setItems(items.filter(i => i.id !== id));
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleDialogOpen(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New {itemType}
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} disabled={isPending}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} {itemType}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder={`e.g., Masala Chai`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
