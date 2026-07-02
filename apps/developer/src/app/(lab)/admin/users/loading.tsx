export default function AdminUsersLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-4 p-6"
    >
      <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      <div className="h-80 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
