import type { AppError } from "@afenda/kernel";

import { logServerActionError } from "./log-action-error";
import {
  serverActionFailure,
  type ServerActionFailure,
} from "./server-action-result";

interface FailServerActionInput {
  readonly action: string;
  readonly error: AppError;
  readonly userId?: string;
}

export async function failServerAction(
  input: FailServerActionInput
): Promise<ServerActionFailure> {
  await logServerActionError(input);
  return serverActionFailure(input.error);
}
