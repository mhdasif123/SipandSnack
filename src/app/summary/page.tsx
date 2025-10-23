import { AppHeader } from "@/components/app-header";
import { CurrentTime } from "@/components/current-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { teaItems, snackItems } from "@/lib/data";
import { Coffee, Cookie } from "lucide-react";

export default function SummaryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-headline font-bold">Today's Order Summary</h1>
            <p className="text-muted-foreground mt-2">
              <CurrentTime />
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Coffee className="w-6 h-6" />
                  Tea Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {teaItems.map((item, index) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-mono text-sm text-muted-foreground">₹{item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Cookie className="w-6 h-6" />
                  Snack Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {snackItems.map((item, index) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.name}</span>
                      <span className="font-mono text-sm text-muted-foreground">₹{item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sip & Snack
      </footer>
    </div>
  );
}
