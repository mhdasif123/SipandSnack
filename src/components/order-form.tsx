"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { orderSchema } from "@/lib/schemas";
import type { Employee, Item } from "@/lib/data";
import { submitOrderAction } from "@/lib/actions";
import { useOrderWindow } from "@/lib/hooks/use-order-window";
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";

type OrderFormProps = {
  employees: Employee[];
  teaItems: Item[];
  snackItems: Item[];
};

type FormStatus = {
  type: "success" | "error";
  message: string;
} | null;

export function OrderForm({
  employees,
  teaItems,
  snackItems,
}: OrderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState<FormStatus>(null);
  const { isOpen, message } = useOrderWindow();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      employeeName: "",
      tea: "",
      snack: "",
    },
  });

  function onSubmit(data: z.infer<typeof orderSchema>) {
    setFormStatus(null);
    startTransition(async () => {
      const result = await submitOrderAction(data);
      if (result.success) {
        setFormStatus({ type: "success", message: result.message });
        form.reset();
      } else {
        setFormStatus({ type: "error", message: result.message });
      }
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Place Your Order</CardTitle>
        <CardDescription>
          Select your tea and snack for the day.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Alert variant={isOpen ? "default" : "destructive"}>
              {isOpen ? <Info className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{isOpen ? "Order Window Open" : "Order Window Closed"}</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <fieldset disabled={!isOpen || isPending} className="space-y-4">
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.name}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tea</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your tea" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teaItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name} (₹{item.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="snack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snack</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your snack" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {snackItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name} (₹{item.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Max ₹25)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            {formStatus && (
              <Alert variant={formStatus.type === 'error' ? 'destructive' : 'default'}>
                {formStatus.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{formStatus.type === 'success' ? 'Success!' : 'Error'}</AlertTitle>
                <AlertDescription>{formStatus.message}</AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!isOpen || isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Order"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
