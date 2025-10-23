import { getTeaItems } from "@/lib/data";
import { ItemManagement } from "@/components/item-management";

export default async function TeaPage() {
  const teaItems = await getTeaItems();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Manage Tea Menu</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, or remove tea items available for ordering.
        </p>
      </header>
      <ItemManagement
        initialItems={teaItems}
        itemType="tea"
        itemTypePlural="tea"
      />
    </div>
  );
}
