import { ShieldCheckIcon } from "lucide-react";

import { AuthAccessFormFields } from "../auth-access-form-fields.js";

const GOVERNANCE_LINES = [
  { key: "tenant", label: "Tenant context", value: "acme-corp · prod-us-east" },
  { key: "policy", label: "Policy bundle", value: "erp-operator-v3.2" },
  { key: "session", label: "Session mode", value: "governed · mfa-ready" },
  {
    key: "audit",
    label: "Audit stream",
    value: "enabled · correlation-id pass-through",
  },
] as const;

const TELEMETRY_ROWS = [
  { metric: "AUTH_LATENCY", reading: "42ms", status: "nominal" },
  { metric: "RBAC_RESOLVE", reading: "12ms", status: "nominal" },
  { metric: "INGRESS_GATE", reading: "armed", status: "watch" },
] as const;

/** P4 — narrow credential rail beside industrial mono governance readout. */
export function P4OperatorConsole() {
  return (
    <div className="grid min-h-dvh bg-zinc-950 text-zinc-100 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <aside className="flex flex-col justify-center border-zinc-800 border-r bg-zinc-900 px-8 py-12">
        <div className="mb-8 space-y-2">
          <p className="font-mono text-[0.62rem] text-zinc-500 uppercase tracking-[0.28em]">
            Access rail
          </p>
          <h1 className="font-mono text-lg tracking-tight">Operator sign-in</h1>
          <p className="text-sm text-zinc-400 leading-6">
            Authenticate against the governed ingress surface.
          </p>
        </div>
        <AuthAccessFormFields />
      </aside>

      <section className="relative overflow-hidden px-8 py-10 font-mono lg:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(63,63,70,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(63,63,70,0.15)_1px,transparent_1px)] bg-size-[24px_24px]"
        />

        <header className="relative z-10 mb-10 flex items-center justify-between gap-4 border-zinc-800 border-b pb-6">
          <div>
            <p className="text-[0.62rem] text-emerald-400/90 uppercase tracking-[0.32em]">
              System readout
            </p>
            <h2 className="mt-2 text-xl tracking-tight">
              Ingress governance panel
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[0.62rem] text-emerald-300 uppercase tracking-[0.2em]">
            <ShieldCheckIcon aria-hidden className="size-3.5" />
            Armed
          </span>
        </header>

        <dl className="relative z-10 grid gap-4 sm:grid-cols-2">
          {GOVERNANCE_LINES.map((line) => (
            <div
              className="rounded border border-zinc-800 bg-zinc-900/80 p-4"
              key={line.key}
            >
              <dt className="text-[0.62rem] text-zinc-500 uppercase tracking-[0.24em]">
                {line.label}
              </dt>
              <dd className="mt-2 text-sm text-zinc-200">{line.value}</dd>
            </div>
          ))}
        </dl>

        <div className="relative z-10 mt-10 rounded border border-zinc-800 bg-black/40 p-4">
          <p className="mb-4 text-[0.62rem] text-zinc-500 uppercase tracking-[0.28em]">
            Live telemetry
          </p>
          <ul className="space-y-3">
            {TELEMETRY_ROWS.map((row) => (
              <li
                className="flex items-center justify-between gap-4 border-zinc-800/80 border-b pb-3 last:border-0 last:pb-0"
                key={row.metric}
              >
                <span className="text-zinc-400">{row.metric}</span>
                <span className="flex items-center gap-3">
                  <span className="text-zinc-200">{row.reading}</span>
                  <span
                    className={
                      row.status === "watch"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }
                  >
                    ●
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
