/**
 * Canonical Step 10 documentation and verification registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 10, lines 601–611).
 */
import { TIP_007_012_DELIVERY_DOC } from "./delivery-evidence-surface-registry.mts";

export const MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE =
  "multi-tenancy-documentation-verification-is-canonical-step-10-delivery-and-ci-chain" as const;

/** Markers that must appear in multi-tenancy.md Step 10 (§601–611). */
export const MULTI_TENANCY_DOC_DOCUMENTATION_VERIFICATION_MARKERS = [
  "Step 10 — Documentation and verification",
  TIP_007_012_DELIVERY_DOC,
  "pnpm typecheck",
  "pnpm test:run",
  "pnpm build",
  "pnpm quality",
] as const;

/** Delivery doc H2 containing Step 10 verification content. */
export const TIP_007_012_VERIFICATION_SECTION = "Verification results" as const;

/** Root commands required by multi-tenancy.md Step 10 (§607–610). */
export const MULTI_TENANCY_VERIFICATION_COMMANDS = [
  {
    id: "typecheck",
    command: "pnpm typecheck",
    packageJsonScript: "typecheck",
  },
  {
    id: "test-run",
    command: "pnpm test:run",
    packageJsonScript: "test:run",
  },
  {
    id: "build",
    command: "pnpm build",
    packageJsonScript: "build",
  },
  {
    id: "quality",
    command: "pnpm quality",
    packageJsonScript: "quality",
  },
] as const;

export const MULTI_TENANCY_VERIFICATION_COMMAND_MARKERS =
  MULTI_TENANCY_VERIFICATION_COMMANDS.map(
    (entry) => entry.command
  ) as readonly [
    "pnpm typecheck",
    "pnpm test:run",
    "pnpm build",
    "pnpm quality",
  ];

/** Delivery doc subsection markers for Step 10. */
export const MULTI_TENANCY_DOCUMENTATION_VERIFICATION_DIMENSIONS = [
  {
    id: "step-10-documentation",
    title: "Step 10 documentation and verification",
    tableMarker: "### Step 10 documentation and verification",
  },
  {
    id: "canonical-verification-commands",
    title: "Canonical verification commands",
    tableMarker: "### Canonical verification commands",
  },
] as const;

export const MULTI_TENANCY_DOCUMENTATION_VERIFICATION_GATE =
  "scripts/governance/check-multi-tenancy-documentation-verification.mts" as const;

export const MULTI_TENANCY_DOCUMENTATION_VERIFICATION_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-documentation-verification-enforcement.mts" as const;
