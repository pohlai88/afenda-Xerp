import type { EnvReaderSource } from "@/lib/env/env-reader-source";
import { resolveObjectStorageCspImgOrigins } from "@/lib/storage/resolve-object-storage-csp-origins";
import {
  appendAllowlistedSources,
  CSP_THIRD_PARTY_ALLOWLIST,
  flattenThirdPartyAllowlist,
} from "./csp-allowlist";
import type { CspPolicyMode } from "./csp-strategy";
import { resolveSupabaseCspPlatformOrigins } from "./csp-supabase-connect-src";

export const CSP_NONCE_HEADER = "x-nonce" as const;

interface ContentSecurityPolicyBaseInput {
  readonly env?: EnvReaderSource;
  readonly isDevelopment: boolean;
}

/** @internal Discriminated union — callers use createContentSecurityPolicy only. */
type ContentSecurityPolicyInput =
  | (ContentSecurityPolicyBaseInput & { readonly mode: "sri" })
  | (ContentSecurityPolicyBaseInput & {
      readonly mode: "nonce";
      readonly nonce: string;
    });

interface SharedCspSources {
  readonly connectSrcExtras: readonly string[];
  readonly fontSrcExtras: readonly string[];
  readonly frameSrcExtras: readonly string[];
  readonly imgSrcExtras: readonly string[];
  readonly scriptSrcExtras: readonly string[];
}

function normalizeCspPolicy(policy: string): string {
  return policy.replace(/\s{2,}/g, " ").trim();
}

function resolveSharedCspSources(
  env: EnvReaderSource | undefined
): SharedCspSources {
  const allowlist = flattenThirdPartyAllowlist(CSP_THIRD_PARTY_ALLOWLIST);
  const supabaseOrigins = resolveSupabaseCspPlatformOrigins(env);
  const storageImgOrigins = resolveObjectStorageCspImgOrigins(env);

  return {
    connectSrcExtras: [...allowlist.connectSrc, ...supabaseOrigins.connectSrc],
    imgSrcExtras: [
      ...allowlist.imgSrc,
      ...supabaseOrigins.imgSrc,
      ...storageImgOrigins,
    ],
    scriptSrcExtras: allowlist.scriptSrc,
    fontSrcExtras: allowlist.fontSrc,
    frameSrcExtras: allowlist.frameSrc,
  };
}

function buildScriptSrcDirective(
  input: ContentSecurityPolicyInput,
  scriptSrcExtras: readonly string[]
): string {
  if (input.mode === "sri") {
    return appendAllowlistedSources(
      input.isDevelopment
        ? "script-src 'self' 'unsafe-eval'"
        : "script-src 'self'",
      scriptSrcExtras
    );
  }

  const nonceToken = `'nonce-${input.nonce}'`;
  return appendAllowlistedSources(
    input.isDevelopment
      ? `script-src 'self' ${nonceToken} 'strict-dynamic' 'unsafe-eval'`
      : `script-src 'self' ${nonceToken} 'strict-dynamic'`,
    scriptSrcExtras
  );
}

function buildStyleSrcDirective(input: ContentSecurityPolicyInput): string {
  if (input.mode === "sri") {
    return input.isDevelopment
      ? "style-src 'self' 'unsafe-inline'"
      : "style-src 'self'";
  }

  // Nonce + unsafe-inline together is invalid — browsers ignore unsafe-inline.
  if (input.isDevelopment) {
    return "style-src 'self' 'unsafe-inline'";
  }

  const nonceToken = `'nonce-${input.nonce}'`;
  return `style-src 'self' ${nonceToken}`;
}

export function createCspNonce(): string {
  const entropy = crypto.getRandomValues(new Uint8Array(16));

  if (typeof Buffer !== "undefined") {
    return Buffer.from(entropy).toString("base64");
  }

  let binary = "";
  for (const byte of entropy) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

export function createContentSecurityPolicy(
  input: ContentSecurityPolicyInput
): string {
  const sources = resolveSharedCspSources(input.env);

  const scriptSrc = buildScriptSrcDirective(input, sources.scriptSrcExtras);
  const styleSrc = buildStyleSrcDirective(input);

  const connectSrc = appendAllowlistedSources(
    input.isDevelopment
      ? "connect-src 'self' ws: wss: http://127.0.0.1:* http://localhost:*"
      : "connect-src 'self'",
    sources.connectSrcExtras
  );

  const directives = [
    "default-src 'self'",
    scriptSrc,
    styleSrc,
    appendAllowlistedSources(
      "img-src 'self' blob: data:",
      sources.imgSrcExtras
    ),
    appendAllowlistedSources("font-src 'self'", sources.fontSrcExtras),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    connectSrc,
    appendAllowlistedSources("worker-src 'self' blob:", []),
    ...(sources.frameSrcExtras.length > 0
      ? [appendAllowlistedSources("frame-src 'self'", sources.frameSrcExtras)]
      : []),
  ];

  if (!input.isDevelopment) {
    directives.push("upgrade-insecure-requests");
  }

  return normalizeCspPolicy(directives.join("; "));
}

export interface ApplyContentSecurityPolicyResult {
  readonly mode: CspPolicyMode;
  readonly nonce: string | null;
}

type ContentSecurityPolicySharedInput = Omit<
  ContentSecurityPolicyInput,
  "mode" | "nonce"
>;

export function applyContentSecurityPolicy(
  requestHeaders: Headers,
  responseHeaders: Headers,
  isDevelopment: boolean,
  mode: CspPolicyMode,
  env?: EnvReaderSource
): ApplyContentSecurityPolicyResult {
  const sharedInput: ContentSecurityPolicySharedInput = {
    isDevelopment,
    ...(env === undefined ? {} : { env }),
  };

  if (mode === "sri") {
    const policy = createContentSecurityPolicy({
      ...sharedInput,
      mode: "sri",
    });

    requestHeaders.delete(CSP_NONCE_HEADER);
    requestHeaders.set("Content-Security-Policy", policy);
    responseHeaders.set("Content-Security-Policy", policy);

    return { mode: "sri", nonce: null };
  }

  const nonce = createCspNonce();
  const policy = createContentSecurityPolicy({
    ...sharedInput,
    mode: "nonce",
    nonce,
  });

  requestHeaders.set(CSP_NONCE_HEADER, nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  responseHeaders.set("Content-Security-Policy", policy);

  return { mode: "nonce", nonce };
}
