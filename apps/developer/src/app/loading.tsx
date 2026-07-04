export default function RootLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-6 text-foreground">
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          aria-hidden="true"
          className="size-10 animate-spin rounded-full border border-border border-t-foreground"
        />
        <p className="text-muted-foreground text-sm">
          Preparing the developer route lab.
        </p>
      </div>
    </main>
  );
}
