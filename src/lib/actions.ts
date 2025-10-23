"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isToday, parseISO } from 'date-fns';

import { orderSchema } from "./schemas";
import { addOrder, getOrders } from "./data";

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
    const existingOrders = await getOrders();
    const hasOrderedToday = existingOrders.some(order => 
        order.employeeName === data.employeeName && isToday(parseISO(order.orderDate))
    );

    if (hasOrderedToday) {
        return { success: false, message: "You have already placed an order today." };
    }

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
    const { addEmployee } = await import("./data");
    await addEmployee(name);
    revalidatePath('/admin/employees');
}
export async function updateEmployeeAction(id: string, name: string) {
    const { updateEmployee } = await import("./data");
    await updateEmployee(id, name);
    revalidatePath('/admin/employees');
}
export async function deleteEmployeeAction(id: string) {
    const { deleteEmployee } = await import("./data");
    await deleteEmployee(id);
    revalidatePath('/admin/employees');
}

// Item Actions
export async function addItemAction(type: 'tea' | 'snack', data: { name: string, price: number }) {
    const { addItem } = await import("./data");
    await addItem(type, data);
    revalidatePath(`/admin/${type}`);
}
export async function updateItemAction(type: 'tea' | 'snack', id: string, data: { name: string, price: number }) {
    const { updateItem } = await import("./data");
    await updateItem(type, id, data);
    revalidatePath(`/admin/${type}`);
}
export async function deleteItemAction(type: 'tea' | 'snack', id: string) {
    const { deleteItem } = await import("./data");
    await deleteItem(type, id);
    revalidatePath(`/admin/${type}`);
}
