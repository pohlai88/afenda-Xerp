export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-6">
      <h1 className="font-semibold text-xl text-foreground">Page not found</h1>
      <p className="text-foreground-muted text-sm">
        The requested route does not exist.
      </p>
    </main>
  );
}
