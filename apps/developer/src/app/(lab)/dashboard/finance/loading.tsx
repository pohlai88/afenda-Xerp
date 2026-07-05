export default function FinanceDashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      <div className="h-64 animate-pulse rounded-3xl bg-muted" />
      <div className="h-72 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
    </div>
  );
}
