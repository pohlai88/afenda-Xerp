import { ActivityIcon, LockIcon, ShieldIcon } from "lucide-react";

import { AuthAccessFormFields } from "../auth-access-form-fields.js";

const TRUST_TILES = [
  {
    id: "soc2",
    icon: ShieldIcon,
    label: "SOC 2 Type II",
    value: "In audit scope",
    span: "col-span-1 row-span-1",
  },
  {
    id: "uptime",
    icon: ActivityIcon,
    label: "Platform uptime",
    value: "99.97% · 30d",
    span: "col-span-1 row-span-1",
  },
  {
    id: "encryption",
    icon: LockIcon,
    label: "Encryption",
    value: "TLS 1.3 · at rest AES-256",
    span: "col-span-1 row-span-1 sm:col-span-2",
  },
] as const;

/** P6 — asymmetric bento grid pairing access with trust/KPI tiles. */
export function P6BentoTrust() {
  return (
    <div className="min-h-dvh bg-background px-4 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <section className="rounded-2xl border border-border/70 bg-card p-8 shadow-sm lg:col-span-5 lg:row-span-2">
          <div className="mb-8 space-y-2">
            <p className="font-medium text-[0.68rem] text-muted-foreground uppercase tracking-[0.28em]">
              Access
            </p>
            <h1 className="font-semibold text-3xl tracking-tight">
              Sign in with confidence
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              Credentials meet governance controls before you reach operator
              surfaces.
            </p>
          </div>
          <AuthAccessFormFields />
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {TRUST_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <article
                className={`rounded-2xl border border-border/60 bg-muted/30 p-6 transition-shadow hover:shadow-md ${tile.span}`}
                key={tile.id}
              >
                <Icon aria-hidden className="mb-4 size-5 text-primary" />
                <p className="font-medium text-[0.68rem] text-muted-foreground uppercase tracking-[0.24em]">
                  {tile.label}
                </p>
                <p className="mt-3 font-semibold text-lg tracking-tight">
                  {tile.value}
                </p>
              </article>
            );
          })}

          <article className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:col-span-2">
            <p className="font-medium text-[0.68rem] text-primary uppercase tracking-[0.24em]">
              Operator KPI
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-3xl tracking-tight">4.2k</p>
                <p className="text-muted-foreground text-xs">Daily sign-ins</p>
              </div>
              <div>
                <p className="font-semibold text-3xl tracking-tight">
                  &lt;50ms
                </p>
                <p className="text-muted-foreground text-xs">Auth p95</p>
              </div>
              <div>
                <p className="font-semibold text-3xl tracking-tight">0</p>
                <p className="text-muted-foreground text-xs">Open incidents</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
