/**
 * Supabase Management API advisor scan — ARCH-SUPA-001 Slice 9.
 * Authority: SUPA-P1-ADVISORS-001 operator runbook + release evidence.
 */
import { loadMergedEnv, resolveRepoRoot } from "../env-utils.mjs";

export const SUPABASE_ADVISOR_KINDS = ["security", "performance"];

/** @typedef {"security" | "performance"} SupabaseAdvisorKind */

/**
 * @typedef {object} SupabaseAdvisorLint
 * @property {string} [name]
 * @property {string} [title]
 * @property {string} [level]
 * @property {string} [detail]
 */

/**
 * @param {string | null | undefined} publicUrl
 * @returns {string | null}
 */
export function resolveSupabaseProjectRefFromPublicUrl(publicUrl) {
  if (!publicUrl?.trim()) {
    return null;
  }

  return new URL(publicUrl.trim()).hostname.split(".")[0] ?? null;
}

/**
 * @param {import("../env-utils.mjs").MergedEnvResult["entries"]} entries
 * @returns {string | null}
 */
export function resolveSupabaseProjectRef(entries) {
  const explicit = entries.get("SUPABASE_PROJECT_REF")?.trim();
  if (explicit) {
    return explicit;
  }

  return resolveSupabaseProjectRefFromPublicUrl(
    entries.get("NEXT_PUBLIC_SUPABASE_URL")
  );
}

/**
 * @param {readonly SupabaseAdvisorLint[]} lints
 * @returns {SupabaseAdvisorLint[]}
 */
export function collectBlockingAdvisorLints(lints) {
  return lints.filter((lint) => {
    const level = lint.level?.toUpperCase() ?? "";
    return level === "ERROR" || level === "CRITICAL";
  });
}

/**
 * @param {Record<string, readonly SupabaseAdvisorLint[]>} advisorsByKind
 */
export function summarizeAdvisorScan(advisorsByKind) {
  const blocking = [];

  for (const kind of SUPABASE_ADVISOR_KINDS) {
    for (const lint of collectBlockingAdvisorLints(
      advisorsByKind[kind] ?? []
    )) {
      blocking.push({ kind, ...lint });
    }
  }

  const warnCount = SUPABASE_ADVISOR_KINDS.reduce(
    (total, kind) =>
      total +
      (advisorsByKind[kind] ?? []).filter(
        (lint) => lint.level?.toUpperCase() === "WARN"
      ).length,
    0
  );

  return {
    ok: blocking.length === 0,
    blocking,
    warnCount,
    scannedAt: new Date().toISOString(),
  };
}

/**
 * @param {object} input
 * @param {string} input.projectRef
 * @param {string} input.token
 * @param {typeof fetch} [input.fetchImpl]
 * @returns {Promise<Record<string, SupabaseAdvisorLint[]>>}
 */
export async function fetchSupabaseAdvisors({
  projectRef,
  token,
  fetchImpl = fetch,
}) {
  /** @type {Record<string, SupabaseAdvisorLint[]>} */
  const advisorsByKind = {};

  for (const kind of SUPABASE_ADVISOR_KINDS) {
    const response = await fetchImpl(
      `https://api.supabase.com/v1/projects/${projectRef}/advisors/${kind}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Supabase advisors/${kind} failed (${response.status} ${response.statusText})`
      );
    }

    const body = await response.json();
    advisorsByKind[kind] = Array.isArray(body.lints) ? body.lints : [];
  }

  return advisorsByKind;
}

/**
 * @param {object} [options]
 * @param {string} [options.repoRoot]
 * @param {(path: string) => string | null} [options.readAccessToken]
 * @param {typeof fetch} [options.fetchImpl]
 */
export async function runSupabaseAdvisorScan(options = {}) {
  const repoRoot = options.repoRoot ?? resolveRepoRoot();
  const merged = loadMergedEnv(repoRoot);
  const projectRef = resolveSupabaseProjectRef(merged.entries);
  const token =
    options.readAccessToken?.(repoRoot) ??
    merged.entries.get("SUPABASE_ACCESS_TOKEN")?.trim() ??
    null;

  if (!token) {
    return {
      status: "skipped",
      reason: "missing SUPABASE_ACCESS_TOKEN",
    };
  }

  if (!projectRef) {
    return {
      status: "skipped",
      reason: "missing SUPABASE_PROJECT_REF",
    };
  }

  const advisorsByKind = await fetchSupabaseAdvisors({
    projectRef,
    token,
    fetchImpl: options.fetchImpl,
  });

  const summary = summarizeAdvisorScan(advisorsByKind);

  return {
    status: summary.ok ? "pass" : "fail",
    projectRef,
    advisorsByKind,
    summary,
  };
}
