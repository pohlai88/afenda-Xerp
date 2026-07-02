import Link from "next/link";

import { labNavGroups } from "@/config/nav-config";

export default function LabIndexPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">
          Developer Route Lab
        </h1>
        <p className="text-muted-foreground text-sm">
          Full operator chrome — same frontend law as ERP production. Static
          fixtures only; no auth or integration spine.
        </p>
      </header>

      <section className="space-y-4">
        {labNavGroups.map((group) => (
          <div className="space-y-2" key={group.label}>
            <h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {group.label}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex w-full rounded-md border px-4 py-2 text-sm transition-colors hover:bg-accent"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
