export default function RootLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-6"
    >
      <div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
    </main>
  );
}
