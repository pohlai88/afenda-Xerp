export default function RootNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background p-6 text-foreground">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
          Developer route lab
        </p>
        <h1 className="font-semibold text-2xl tracking-tight">
          Surface not found
        </h1>
        <p className="text-muted-foreground text-sm">
          The requested developer sandbox route does not exist.
        </p>
      </div>
    </main>
  );
}
