import { getEmployees } from "@/lib/data";
import { EmployeeManagement } from "@/components/employee-management";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Manage Employees</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, or remove employees from the system.
        </p>
      </header>
      <EmployeeManagement initialEmployees={employees} />
    </div>
  );
}
