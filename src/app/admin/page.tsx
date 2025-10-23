import { getOrders } from "@/lib/data";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  const orders = await getOrders();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all employee orders.
        </p>
      </header>
      <AdminDashboard initialOrders={orders} />
    </div>
  );
}
