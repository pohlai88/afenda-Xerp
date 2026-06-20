import { createHmac, randomUUID } from "node:crypto";
import type { StorageIsoTimestamp } from "../contracts/storage-object.contract.js";

export interface SignedUrlOptions {
  readonly baseUrl: string;
  readonly expiresAt: StorageIsoTimestamp;
  readonly method: "GET" | "PUT";
  readonly objectId: string;
  readonly path: string;
  readonly signingSecret: string;
  readonly tenantId: string;
}

const SIGNED_URL_VERSION = "1";

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path;
}

export function createStorageObjectId(): string {
  return randomUUID();
}

export function createSignedStorageUrl(options: SignedUrlOptions): string {
  const canonicalPath = normalizePath(options.path);
  const payload = [
    SIGNED_URL_VERSION,
    options.method,
    options.tenantId,
    options.objectId,
    canonicalPath,
    options.expiresAt,
  ].join("\n");
  const signature = createHmac("sha256", options.signingSecret)
    .update(payload)
    .digest("hex");
  const url = new URL(
    `${normalizeBaseUrl(options.baseUrl)}/${encodeURIComponent(canonicalPath)}`
  );

  url.searchParams.set("expiresAt", options.expiresAt);
  url.searchParams.set("objectId", options.objectId);
  url.searchParams.set("signature", signature);
  url.searchParams.set("tenantId", options.tenantId);
  url.searchParams.set("version", SIGNED_URL_VERSION);

  return url.toString();
}
