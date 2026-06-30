import type { OperatingContext } from "@afenda/kernel";
import { redirect } from "next/navigation";

import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { isOperatingContextPermissionGranted } from "@/lib/permissions/check-operating-context-permission.server";

import {
  SYSTEM_ADMIN_SECTIONS,
  type SystemAdminSectionDefinition,
} from "./system-admin-sections";

export interface SystemAdminSectionPageContext {
  readonly operatingContext: OperatingContext;
  readonly section: SystemAdminSectionDefinition;
}

function findSystemAdminSection(
  sectionId: string
): SystemAdminSectionDefinition | undefined {
  return SYSTEM_ADMIN_SECTIONS.find(
    (section) => section.sectionId === sectionId
  );
}

export async function loadSystemAdminSectionPage(
  sectionId: string
): Promise<SystemAdminSectionPageContext> {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    redirect("/access-denied");
  }

  const section = findSystemAdminSection(sectionId);

  if (section === undefined) {
    redirect("/access-denied");
  }

  const granted = await isOperatingContextPermissionGranted({
    operatingContext: operatingResult.value,
    permissionKey: section.readPermissionKey,
  });

  if (!granted) {
    redirect("/access-denied");
  }

  return {
    operatingContext: operatingResult.value,
    section,
  };
}
