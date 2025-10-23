"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="admin"
          required
          defaultValue="admin"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          defaultValue="password"
        />
      </div>
      {state?.message && (
        <Alert variant="destructive">
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <SubmitButton />
    </form>
  );
}
