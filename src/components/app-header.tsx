import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-headline font-bold">Sip & Snack</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">Order</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/summary">Summary</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Admin Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
