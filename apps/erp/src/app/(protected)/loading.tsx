export default function ProtectedLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[12rem] items-center justify-center p-6"
    >
      <p className="text-foreground-muted text-sm">Loading workspace…</p>
    </div>
  );
}
