import { getSnackItems } from "@/lib/data";
import { ItemManagement } from "@/components/item-management";

export default async function SnacksPage() {
  const snackItems = await getSnackItems();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Manage Snacks Menu</h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, or remove snack items available for ordering.
        </p>
      </header>
      <ItemManagement
        initialItems={snackItems}
        itemType="snack"
        itemTypePlural="snacks"
      />
    </div>
  );
}
