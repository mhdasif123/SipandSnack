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
  DialogTrigger,
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
import { Employee, getEmployees } from "@/lib/data";
import { employeeSchema } from "@/lib/schemas";
import { addEmployeeAction, updateEmployeeAction, deleteEmployeeAction } from "@/lib/actions";

type EmployeeManagementProps = {
  initialEmployees: Employee[];
};

export function EmployeeManagement({ initialEmployees }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: { name: "" },
  });

  const handleDialogOpen = (employee: Employee | null) => {
    setEditingEmployee(employee);
    form.reset({ name: employee?.name || "" });
    setDialogOpen(true);
  };

  const onSubmit = (data: z.infer<typeof employeeSchema>) => {
    startTransition(async () => {
      if (editingEmployee) {
        await updateEmployeeAction(editingEmployee.id, data.name);
        setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...data } : e));
      } else {
        await addEmployeeAction(data.name);
        // Refetch employees to get the latest list with the new ID
        const updatedEmployees = await getEmployees();
        setEmployees(updatedEmployees);
      }
      setDialogOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
        await deleteEmployeeAction(id);
        setEmployees(employees.filter(e => e.id !== id));
    });
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleDialogOpen(null)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDialogOpen(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)} disabled={isPending}>
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
            <DialogTitle>{editingEmployee ? "Edit" : "Add"} Employee</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
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
