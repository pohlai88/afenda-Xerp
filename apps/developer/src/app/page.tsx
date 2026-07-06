import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLabNavGroups } from "@/config/nav-config";
import { labRoutePolicies } from "@/lib/lab/route-policy";

export const metadata: Metadata = {
  title: "Route Lab Index",
  description:
    "Index surface for the Afenda developer route lab, covering ERP-parity route composition without ERP runtime authority.",
};

const doctrine = [
  "apps/developer proves ERP frontend shape.",
  "apps/erp owns ERP runtime authority.",
  "Promotion replaces data authority, not route composition.",
];

export default async function HomePage() {
  const navGroups = getLabNavGroups("/");
  const operatorPolicies = labRoutePolicies.filter(
    (policy) => policy.href !== "/"
  );

  return (
    <main className="lab-grid box-border min-h-screen w-full max-w-full overflow-x-clip px-4 py-10 sm:px-6 lg:px-10">
      <section className="mx-auto flex min-w-0 max-w-6xl flex-col gap-8">
        <div className="overflow-hidden rounded-[2rem] border bg-background/95 shadow-2xl backdrop-blur">
          <div className="lab-demo-banner flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
            <p>
              <strong>Route lab only.</strong> No auth spine, no operating
              context runtime, no BFF handlers.
            </p>
            <p className="text-slate-300">Port 3002 · ADR-0039 · PAS-006E</p>
          </div>
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="font-medium text-primary text-xs uppercase tracking-[0.3em]">
                  Developer Route Lab
                </p>
                <h1 className="max-w-3xl text-balance font-semibold text-4xl tracking-tight">
                  ERP-parity route composition without ERP runtime authority.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  This app proves page structure, shell composition, loading
                  boundaries, and promotion-ready data shapes. It does not prove
                  auth, tenant context, or API wiring.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground"
                  href="/dashboard/sales"
                >
                  Open canonical route
                </Link>
                <Link
                  className="rounded-full border px-5 py-2.5 font-medium"
                  href="/design-system/v2-proof"
                >
                  Open V2 proof route
                </Link>
                <Link
                  className="rounded-full border px-5 py-2.5 font-medium"
                  href="/settings/appearance"
                >
                  Review theme surface
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-100 shadow-xl">
                <Image
                  alt="Abstract blueprint showing the Afenda route lab shell, route panels, and promotion-ready composition."
                  className="h-auto w-full"
                  height={900}
                  preload
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  src="/route-lab-blueprint.svg"
                  width={1200}
                />
              </div>
              <Card className="border-slate-200/70 bg-slate-950 text-slate-50 dark:border-slate-800 dark:bg-slate-950">
                <CardHeader>
                  <CardTitle>Controlling doctrine</CardTitle>
                  <CardDescription className="text-slate-300">
                    Locked architecture boundary for every new route in this
                    app.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {doctrine.map((rule) => (
                      <li
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        key={rule}
                      >
                        {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-2">
          {operatorPolicies.map((policy) => {
            const group = navGroups.find((entry) =>
              entry.items.some((item) => item.href === policy.href)
            );

            return (
              <Card
                className="border-border/60 bg-background/92 backdrop-blur"
                key={policy.routeId}
              >
                <CardHeader>
                  <CardTitle>{policy.routeId}</CardTitle>
                  <CardDescription>
                    {group?.label ?? "Operator surface"} · {policy.kind} ·{" "}
                    {policy.rendering}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Promotion target: {policy.promotionTarget}. Loading
                    boundary:{" "}
                    {policy.requiresLoadingBoundary ? "required" : "optional"}.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Action seam: {policy.actionSeam}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Query seam: {policy.querySeam}
                  </p>
                  {policy.routePath === policy.href ? null : (
                    <p className="text-muted-foreground text-sm">
                      Route contract: {policy.routePath}
                    </p>
                  )}
                  <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <code className="max-w-full break-all rounded-full bg-muted px-3 py-1 text-xs">
                      {policy.routePath}
                    </code>
                    <Link
                      className="rounded-full border px-4 py-2 font-medium text-sm"
                      href={policy.href}
                    >
                      Open route
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </section>
    </main>
  );
}
