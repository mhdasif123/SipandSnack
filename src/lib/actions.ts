"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { orderSchema, employeeSchema, itemSchema } from "./schemas";
import { addOrder, addEmployee, updateEmployee, deleteEmployee, addItem, updateItem, deleteItem } from "./data";

export async function loginAction(previousState: any, formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  if (username === "admin" && password === "password") {
    cookies().set("sip-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    redirect("/admin");
  }

  return {
    message: "Invalid credentials. Please try again.",
  };
}

export async function logout() {
  cookies().delete("sip-auth");
  redirect("/login");
}

export async function submitOrderAction(data: z.infer<typeof orderSchema>) {
  try {
    const newOrder = await addOrder({
        employeeName: data.employeeName,
        tea: data.tea,
        snack: data.snack,
        amount: data.amount,
    });

    console.log("--- New Order Submitted ---");
    console.log(JSON.stringify(newOrder, null, 2));
    console.log("--- SIMULATING WHATSAPP WEBHOOK CALL TO HR ---");
    // In a real app, you would call a webhook here:
    // await fetch('https://your-whatsapp-webhook-url.com', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newOrder),
    // });
    
    revalidatePath('/admin');
    return { success: true, message: "Order placed successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to place order. Please try again." };
  }
}

// Employee Actions
export async function addEmployeeAction(name: string) {
    await addEmployee(name);
    revalidatePath('/admin/employees');
}
export async function updateEmployeeAction(id: string, name: string) {
    await updateEmployee(id, name);
    revalidatePath('/admin/employees');
}
export async function deleteEmployeeAction(id: string) {
    await deleteEmployee(id);
    revalidatePath('/admin/employees');
}

// Item Actions
export async function addItemAction(type: 'tea' | 'snack', data: { name: string, price: number }) {
    await addItem(type, data);
    revalidatePath(`/admin/${type}`);
}
export async function updateItemAction(type: 'tea' | 'snack', id: string, data: { name: string, price: number }) {
    await updateItem(type, id, data);
    revalidatePath(`/admin/${type}`);
}
export async function deleteItemAction(type: 'tea' | 'snack', id: string) {
    await deleteItem(type, id);
    revalidatePath(`/admin/${type}`);
}
