import Link from "next/link";
import type { ReactNode } from "react";

import { listVisibleSystemAdminSections } from "@/lib/system-admin/list-visible-system-admin-sections.server";

export default async function SystemAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const visibleSections = await listVisibleSystemAdminSections();

  return (
    <div className="flex flex-col gap-6">
      {visibleSections.length > 0 ? (
        <nav aria-label="System admin sections">
          <ul className="flex flex-wrap gap-4">
            {visibleSections.map((section) => (
              <li key={section.sectionId}>
                <Link className="app-shell-nav-link" href={section.href}>
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      {children}
    </div>
  );
}
