import Link from "next/link";

export default function NotFound() {
  return (
    <main
      aria-labelledby="developer-route-lab-not-found-title"
      className="flex min-h-screen items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-2xl rounded-[2rem] border bg-background/95 p-8 shadow-2xl backdrop-blur">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Developer Route Lab
        </p>
        <h1
          className="mt-4 text-balance font-semibold text-4xl tracking-tight"
          id="developer-route-lab-not-found-title"
        >
          Route-lab surface not found
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          The requested URL does not match a governed route-lab surface. This
          fallback proves App Router unmatched-route handling only; runtime
          authority remains in ERP.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
            href="/"
          >
            Return to route lab index
          </Link>
          <Link
            className="rounded-full border px-5 py-2.5 font-medium"
            href="/dashboard/sales"
          >
            Open canonical route
          </Link>
        </div>
      </div>
    </main>
  );
}
