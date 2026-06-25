import { getAfendaAuthSession, toAfendaAuthIdentity } from "@afenda/auth";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { SystemAdminSectionNav } from "@/components/system-admin/system-admin-section-nav";
import { toApplicationShellOperatingContext } from "@/lib/context/to-shell-operating-context";
import { listVisibleSystemAdminSections } from "@/lib/system-admin/list-visible-system-admin-sections.server";
import { resolveSystemAdminOperatingContext } from "@/lib/system-admin/resolve-system-admin-operating-context.server";

export default async function SystemAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const visibleSections = await listVisibleSystemAdminSections();
  const operatingResult = await resolveSystemAdminOperatingContext();
  const session = await getAfendaAuthSession(await headers());
  const identity = session === null ? undefined : toAfendaAuthIdentity(session);

  const userProfile =
    identity !== undefined && operatingResult.kind === "ready"
      ? {
          displayName: identity.displayName,
          email: identity.email,
          workspaceLabel: toApplicationShellOperatingContext(
            operatingResult.operatingContext
          ).workspaceLabel,
        }
      : identity === undefined
        ? undefined
        : {
            displayName: identity.displayName,
            email: identity.email,
          };

  return (
    <div className="erp-system-admin-layout">
      {visibleSections.length > 0 ? (
        <SystemAdminSectionNav
          sections={visibleSections.map((section) => ({
            href: section.href,
            label: section.label,
            sectionId: section.sectionId,
          }))}
          {...(userProfile === undefined ? {} : { userProfile })}
        />
      ) : null}
      {children}
    </div>
  );
}
