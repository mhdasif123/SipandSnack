import { z } from "zod";

export const orderSchema = z.object({
  employeeName: z.string({ required_error: "Please select your name." }).min(1, "Please select your name."),
  tea: z.string({ required_error: "Please select a tea." }).min(1, "Please select a tea."),
  snack: z.string({ required_error: "Please select a snack." }).min(1, "Please select a snack."),
  amount: z.coerce
    .number({ invalid_type_error: "Please enter a valid amount."})
    .min(1, "Amount must be at least ₹1.")
    .max(25, "Amount cannot exceed ₹25."),
});

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export const itemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
});
