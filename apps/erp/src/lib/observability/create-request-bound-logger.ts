import type { Logger } from "@afenda/observability";
import { headers } from "next/headers";

import { createErpLogger } from "./create-erp-logger";
import { toErpCorrelationId } from "./erp-correlation-id";
import { resolveCorrelationIdFromHeaders } from "./resolve-correlation-id";

export async function createRequestBoundErpLogger(
  module: string
): Promise<Logger> {
  const requestHeaders = await headers();

  return createErpLogger({
    correlationId: toErpCorrelationId(
      resolveCorrelationIdFromHeaders(requestHeaders)
    ),
    module,
  });
}
