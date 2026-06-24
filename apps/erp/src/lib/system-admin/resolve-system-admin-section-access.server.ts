import type { OperatingContext } from "@afenda/kernel";

import { guardSystemAdminSection } from "./guard-system-admin-section.server";
import { resolveSystemAdminOperatingContext } from "./resolve-system-admin-operating-context.server";
import type {
  SystemAdminSectionDefinition,
  SystemAdminSectionId,
} from "./system-admin-sections";

export type SystemAdminSectionAccessResult =
  | {
      readonly kind: "allowed";
      readonly operatingContext: OperatingContext;
      readonly section: SystemAdminSectionDefinition;
    }
  | {
      readonly kind: "forbidden";
    }
  | {
      readonly kind: "not_found";
    }
  | {
      readonly href: string;
      readonly kind: "redirect";
    };

export async function resolveSystemAdminSectionAccess(
  sectionId: SystemAdminSectionId
): Promise<SystemAdminSectionAccessResult> {
  const operatingResult = await resolveSystemAdminOperatingContext();

  if (operatingResult.kind === "redirect") {
    return operatingResult;
  }

  if (operatingResult.kind === "forbidden") {
    return {
      kind: "forbidden",
    };
  }

  const guardResult = await guardSystemAdminSection({
    sectionId,
    operatingContext: operatingResult.operatingContext,
    correlationId: operatingResult.operatingContext.correlationId,
  });

  if (guardResult.kind === "not_found") {
    return {
      kind: "not_found",
    };
  }

  if (guardResult.kind === "forbidden") {
    return {
      kind: "forbidden",
    };
  }

  return {
    kind: "allowed",
    section: guardResult.section,
    operatingContext: operatingResult.operatingContext,
  };
}
