interface AuthIngressSurfaceFallbackProps {
  readonly message: string;
  readonly state?: "error" | "missing-slot-hydration";
  readonly title: string;
}

export function AuthIngressSurfaceFallback({
  message,
  state = "error",
  title,
}: AuthIngressSurfaceFallbackProps) {
  return (
    <main
      aria-live="polite"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background p-6 text-foreground"
      data-auth-ingress-state={state}
    >
      <h1 className="font-semibold text-xl">{title}</h1>
      <p className="max-w-md text-center text-muted-foreground text-sm">
        {message}
      </p>
    </main>
  );
}
