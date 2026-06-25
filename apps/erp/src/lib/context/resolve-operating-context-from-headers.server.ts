import { getAfendaAuthSession } from "@afenda/auth";
import type {
  OperatingContextResult,
  OperatingContextSelection,
} from "@afenda/kernel";
import { err } from "@afenda/kernel";
import { headers } from "next/headers";

import { resolveCorrelationIdFromHeaders } from "@/lib/observability/resolve-correlation-id";
import { resolveOperatingContext } from "./resolve-operating-context.server";
import { buildOperatingContextSelectionFromRequest } from "./tenant-domain.server";

async function resolveSessionActiveWorkspaceIdHint(
  explicit: string | null | undefined
): Promise<string | null> {
  if (explicit !== undefined) {
    return explicit;
  }

  const session = await getAfendaAuthSession(await headers());
  return session?.metadata.activeWorkspaceId ?? null;
}

export async function resolveOperatingContextFromHeaders(input: {
  readonly activeWorkspaceId?: string | null;
  readonly actorUserId: string;
  readonly selection?: Partial<Omit<OperatingContextSelection, "tenantSlug">>;
}): Promise<OperatingContextResult> {
  const activeWorkspaceId = await resolveSessionActiveWorkspaceIdHint(
    input.activeWorkspaceId
  );
  const built = await buildOperatingContextSelectionFromRequest({
    activeWorkspaceId,
    ...(input.selection === undefined ? {} : { selection: input.selection }),
  });

  if (!built.ok) {
    return err(built.error);
  }

  const requestHeaders = await headers();

  return resolveOperatingContext({
    actorUserId: input.actorUserId,
    correlationId: resolveCorrelationIdFromHeaders(requestHeaders),
    selection: built.selection,
  });
}
