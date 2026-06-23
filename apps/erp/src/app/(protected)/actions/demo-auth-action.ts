"use server";

import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

const DEMO_PROTECTED_RECORD_ACTION = "demo.protected.record" as const;

const recordProtectedDemoMessageSchema = z.object({
  message: z.string().trim().min(1).max(500),
});

export type ProtectedDemoActionData = {
  readonly message: string;
};

export type ProtectedDemoActionResult =
  ServerActionResult<ProtectedDemoActionData>;

export async function recordProtectedDemoAction(
  input: unknown
): Promise<ProtectedDemoActionResult> {
  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: DEMO_PROTECTED_RECORD_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext, session } = contextResult;
  const actorUserId = session.user.userId?.trim() ?? "";

  const parsed = parseProtectedActionInput(
    recordProtectedDemoMessageSchema,
    input
  );
  if (!parsed.ok) {
    return failServerAction({
      action: DEMO_PROTECTED_RECORD_ACTION,
      error: parsed.error,
      userId: actorUserId,
    });
  }

  await recordActionAudit({
    action: DEMO_PROTECTED_RECORD_ACTION,
    actorUserId,
    module: "erp.demo",
    result: "success",
    targetId: operatingContext.workspace.companyId,
    targetType: "workspace.company",
  });

  return serverActionSuccess({
    message: parsed.value.message,
  });
}
