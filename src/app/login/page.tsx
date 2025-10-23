import { AppHeader } from "@/components/app-header";
import { LoginForm } from "@/components/login-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
         © {new Date().getFullYear()} Sip & Snack
      </footer>
    </div>
  )
}
