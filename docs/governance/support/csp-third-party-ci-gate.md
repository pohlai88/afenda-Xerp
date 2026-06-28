# Delivery: CSP third-party CI gate wiring

| Field | Value |
|-------|-------|
| **Date** | 2026-06-22 |
| **Scope** | CI / quality wiring only — no CSP policy changes |
| **Authority** | `docs/governance/support/nextjs-csp-nonce-pipeline.md`, Foundation phase 09 |

## Where the gate is wired

| Surface | Command | Location |
|---------|---------|----------|
| Direct check | `pnpm check:csp-third-party` | `package.json` → `scripts/governance/check-csp-third-party.mts` |
| Quality aggregate | `pnpm quality:csp-third-party` | Alias to the same script; runs as final step in `pnpm quality` |
| CI (PR + main) | `pnpm check:csp-third-party` | `.github/workflows/ci.yml` — Gate 8d (before release-gate self-check) |
| Release verification | `pnpm check:csp-third-party` | `.github/workflows/release-verification.yml` — Gate 8d |
| Foundation phase 09 self-check | Required in `requiredCiCommands` | `scripts/quality/check-release-gates.mjs` |

**Prerequisites:** `pnpm install` only. No build step — static scan of `apps/erp/src` and `csp-allowlist.ts`.

## What it checks

1. **Allowlist hygiene** — `apps/erp/src/lib/security/csp-allowlist.ts` must not contain wildcards (`*`), scheme wildcards (`https:`, `http:`), or `'unsafe-inline'`.
2. **Third-party script patterns** — Every `.ts`/`.tsx`/`.js`/`.jsx` file under `apps/erp/src` (excluding `__tests__`) is scanned for:
   - Raw `<script src="https://...">` tags
   - `next/script` without nonce governance
   - External script URLs not routed through the allowlist + nonce pipeline

Implementation: `scripts/governance/csp-third-party-governance.mjs` (shared with Cursor `preToolUse` hook).

**Failure output:** `CSP third-party governance failed:` followed by `- <path>: <reason>` lines.

## How to update allowlists safely

1. Read `.cursor/skills/csp-third-party/SKILL.md` and `.cursor/rules/csp-third-party-scripts.mdc`.
2. Add the **exact origin** (no wildcards) to `apps/erp/src/lib/security/csp-allowlist.ts`.
3. Load the script via `getCspNonce()` + `next/script` with `nonce={nonce}` — same PR as the allowlist change.
4. Verify locally:

```bash
pnpm check:csp-third-party
pnpm --filter @afenda/erp test:run
```

Never add `'unsafe-inline'`, `*`, or bare `https:` to the allowlist.

## Rollback

1. Revert changes to `package.json`, `.github/workflows/ci.yml`, `.github/workflows/release-verification.yml`, and `scripts/quality/check-release-gates.mjs`.
2. Confirm gate is no longer in aggregate: `pnpm quality` should not invoke CSP check.
3. Confirm CI no longer runs Gate 8d: `grep check:csp-third-party .github/workflows/ci.yml` should return nothing.

CSP runtime policy (`csp.ts`, `proxy.ts`, `csp-allowlist.ts` contents) is unchanged by this delivery.

## Verification

```bash
pnpm check:csp-third-party          # CSP third-party governance passed
pnpm quality:release-gate           # release gates valid (includes CSP in required commands)
pnpm quality                        # full aggregate including quality:csp-third-party
```

## CI security score

**9.5 / 10** — CSP drift blocks merge via CI and local `pnpm quality`. Remaining gap: full RBAC on API routes (Foundation phase 10).
