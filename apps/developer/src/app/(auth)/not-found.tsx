export default function AuthNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-6 text-foreground">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          Developer auth ingress
        </p>
        <h1 className="font-semibold text-2xl tracking-tight">
          Auth surface not found
        </h1>
        <p className="text-muted-foreground text-sm">
          The requested auth fixture route is not registered in the developer
          sandbox.
        </p>
      </div>
    </main>
  );
}
