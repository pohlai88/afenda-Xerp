export default function SalesDashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="h-48 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
      <div className="h-48 animate-pulse rounded-3xl bg-muted" />
      <div className="h-80 animate-pulse rounded-3xl bg-muted" />
      <div className="h-80 animate-pulse rounded-3xl bg-muted lg:col-span-2" />
    </div>
  );
}
