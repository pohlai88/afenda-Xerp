import "server-only";

import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "./csp";

export async function getCspNonce(): Promise<string | null> {
  const requestHeaders = await headers();
  const nonce = requestHeaders.get(CSP_NONCE_HEADER);

  if (nonce === null) {
    return null;
  }

  const normalized = nonce.trim();
  return normalized.length > 0 ? normalized : null;
}
