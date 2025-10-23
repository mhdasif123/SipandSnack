import { OrderForm } from "@/components/order-form";
import { getEmployees, getTeaItems, getSnackItems } from "@/lib/data";
import { AppHeader } from "@/components/app-header";

export default async function Home() {
  const employees = await getEmployees();
  const teaItems = await getTeaItems();
  const snackItems = await getSnackItems();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <OrderForm
            employees={employees}
            teaItems={teaItems}
            snackItems={snackItems}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sip & Snack
      </footer>
    </div>
  );
}
