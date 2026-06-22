import type {
  OperatingContextResult,
  OperatingContextSelection,
} from "@afenda/kernel";
import { err } from "@afenda/kernel";
import { headers } from "next/headers";

import { resolveCorrelationIdFromHeaders } from "@/lib/observability/resolve-correlation-id";

import { buildOperatingContextSelectionFromRequest } from "./tenant-domain.server";
import { resolveOperatingContext } from "./resolve-operating-context.server";

export async function resolveOperatingContextFromHeaders(input: {
  readonly actorUserId: string;
  readonly selection?: Partial<
    Omit<OperatingContextSelection, "tenantSlug">
  >;
}): Promise<OperatingContextResult> {
  const built = await buildOperatingContextSelectionFromRequest(input);

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
