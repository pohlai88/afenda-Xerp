export default function SalesDashboardLoading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex flex-col gap-4 p-6"
    >
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["a", "b", "c", "d"].map((key) => (
          <div className="h-28 animate-pulse rounded-xl bg-muted" key={key} />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
