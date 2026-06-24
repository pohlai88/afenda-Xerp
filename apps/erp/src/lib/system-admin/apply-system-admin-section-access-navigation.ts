import { forbidden, notFound, redirect } from "next/navigation";

import type { SystemAdminSectionAccessResult } from "./resolve-system-admin-section-access.server";

type AllowedSystemAdminSectionAccess = Extract<
  SystemAdminSectionAccessResult,
  { readonly kind: "allowed" }
>;

/** Applies Next.js navigation for denied system-admin section access; narrows to allowed. */
export function applySystemAdminSectionAccessNavigation(
  access: SystemAdminSectionAccessResult
): asserts access is AllowedSystemAdminSectionAccess {
  if (access.kind === "redirect") {
    redirect(access.href);
  }

  if (access.kind === "forbidden") {
    forbidden();
  }

  if (access.kind === "not_found") {
    notFound();
  }
}
