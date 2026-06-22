export default function RootLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center p-6"
    >
      <p className="text-foreground-muted text-sm">Loading…</p>
    </main>
  );
}
