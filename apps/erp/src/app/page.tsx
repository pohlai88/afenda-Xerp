export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="font-semibold text-2xl text-foreground">Afenda ERP</h1>
      <p className="max-w-md text-center text-muted-foreground text-sm">
        Presentation reset complete. Wire shadcn-studio blocks from{" "}
        <code className="font-mono text-xs">@afenda/shadcn-studio</code> here
        when you are ready to build.
      </p>
    </main>
  );
}
