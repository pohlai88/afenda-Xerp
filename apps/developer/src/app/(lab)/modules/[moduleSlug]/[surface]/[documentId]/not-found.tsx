import Link from "next/link";

export default function ModuleDocumentNotFound() {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl space-y-3">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Module Document Surface
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Route-lab document fixture not found
        </h1>
        <p className="text-muted-foreground">
          The requested module document route does not match the governed
          route-lab fixture contract. This is a route-family validation
          boundary, not an ERP authority response.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
          href="/modules/procurement/requisition/REQ-1001"
        >
          Open canonical document route
        </Link>
        <Link className="rounded-full border px-5 py-2.5 font-medium" href="/">
          Return to route lab index
        </Link>
      </div>
    </section>
  );
}
