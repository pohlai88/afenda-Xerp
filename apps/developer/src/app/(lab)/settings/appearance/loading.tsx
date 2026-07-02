export default function AppearanceSettingsLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-6"
    >
      <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      <div className="h-64 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
