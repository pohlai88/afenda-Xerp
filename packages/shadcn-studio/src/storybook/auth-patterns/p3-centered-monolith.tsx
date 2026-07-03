import LogoIcon from "../../components-assets/icon-logo.js";
import { AuthAccessFormFields } from "../auth-access-form-fields.js";

/** P3 — single centered card on a quiet light canvas; refined minimal hierarchy. */
export function P3CenteredMonolith() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-10 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <LogoIcon className="size-7" variant="brand" />
          </div>
          <h1 className="font-semibold text-2xl tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            Sign in to your governed operator workspace.
          </p>
        </div>
        <AuthAccessFormFields showSignUpLink />
      </div>
    </div>
  );
}
