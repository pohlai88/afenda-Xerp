#!/usr/bin/env node
/**
 * preToolUse — consolidated edit guards for afenda-Xerp.
 * Registered with a Write/StrReplace matcher in hooks.json.
 */
import {
  allow,
  ask,
  deny,
  extractPath,
  hasEnvSyncWorkflow,
  log,
  parseStdinJson,
  resolveRepoRoot,
} from "./_hook-utils.mjs";
import {
  findDeprecatedKeys,
  isEditableEnvSource,
  isSyncedEnvOutput,
} from "./env-policy.mjs";
import {
  checkGovernedUiConsumption,
  GOVERNED_UI_CONSUMER_PATH,
} from "../../scripts/governance/governed-ui-consumption.mjs";
import {
  checkCspThirdPartyGovernance,
  CSP_ERP_SOURCE_PATH,
} from "../../scripts/governance/csp-third-party-governance.mjs";

const TAG = "guard-pre-tool-use";

const DESIGN_SYSTEM_UI =
  /packages[/\\]design-system[/\\]components[/\\]ui[/\\]/i;

const ENV_PATH = /(?:^|[/\\])\.env(?:\.|$)|\.env\.example$/i;

// ─── Raw Tailwind policy ─────────────────────────────────────────────────────

/** Story files under packages/ui: spacing + arbitrary-value guard. */
const UI_STORY_FILE =
  /packages[/\\]ui[/\\]src[/\\]components[/\\][^/\\]+\.stories\.tsx$/i;

/**
 * Governed component files under packages/ui.
 * Excludes story files and the storybook helpers directory.
 */
const UI_COMPONENT_FILE =
  /packages[/\\]ui[/\\]src[/\\]components[/\\](?!_storybook)[^/\\]+\.tsx$/i;

/**
 * Raw palette color utilities — absolutely forbidden in governed components
 * and story files.  e.g. bg-red-500, text-blue-700.
 */
const RAW_PALETTE_RE =
  /\b(?:bg|text|border|ring|fill|stroke|decoration|from|via|to|shadow|outline|caret|accent)-(?:inherit|current|transparent|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;

/**
 * Spacing utilities forbidden in static className strings inside story files.
 * Stories must use StoryRow / StoryStack gap + padding props instead.
 */
const STORY_SPACING_TOKEN_RE =
  /\b(?:m[trblxy]?|p[trblxy]?|space-[xy])-(?:\d|auto)/;

/**
 * Arbitrary value utilities forbidden everywhere in stories.
 * Excludes CSS pseudo-class brackets like has-[:checked].
 */
const STORY_ARBITRARY_TOKEN_RE = /\w+-\[(?!:)[^\]]*\]/;

const STATIC_CLASS_STRING_RE = /className="([^"]+)"/g;

function checkRawTailwindInStory(content) {
  const violations = [];
  let match;

  STATIC_CLASS_STRING_RE.lastIndex = 0;
  while ((match = STATIC_CLASS_STRING_RE.exec(content)) !== null) {
    const classStr = match[1];

    for (const token of classStr.split(/\s+/)) {
      if (RAW_PALETTE_RE.test(token)) {
        violations.push(
          `"${token}" — raw color-scale palette (use semantic tokens instead)`
        );
      } else if (STORY_SPACING_TOKEN_RE.test(token)) {
        violations.push(
          `"${token}" — spacing utility (use StoryRow/StoryStack gap/padding props)`
        );
      } else if (STORY_ARBITRARY_TOKEN_RE.test(token)) {
        violations.push(
          `"${token}" — arbitrary value utility (move override to a governed recipe)`
        );
      }
    }
  }

  return violations;
}

/**
 * Semantic Tailwind forbidden in governed component implementations
 * (the ones that should call resolvePrimitiveGovernance).
 */
const PROHIBITED_SEMANTIC_RE =
  /\b(?:bg|text|border|ring)-(?:primary|secondary|muted|accent|destructive|foreground|background|card|popover|input)(?:-foreground)?\b/;

const ARBITRARY_RADIUS_SHADOW_RE = /\b(?:rounded|shadow|text)-\[/;

function checkRawTailwindInComponent(content) {
  const violations = [];
  let match;

  STATIC_CLASS_STRING_RE.lastIndex = 0;
  while ((match = STATIC_CLASS_STRING_RE.exec(content)) !== null) {
    const classStr = match[1];

    for (const token of classStr.split(/\s+/)) {
      if (RAW_PALETTE_RE.test(token)) {
        violations.push(
          `"${token}" — raw color-scale palette forbidden in governed component`
        );
      } else if (PROHIBITED_SEMANTIC_RE.test(token)) {
        violations.push(
          `"${token}" — semantic Tailwind must flow through resolvePrimitiveGovernance`
        );
      } else if (ARBITRARY_RADIUS_SHADOW_RE.test(token)) {
        violations.push(
          `"${token}" — arbitrary radius/shadow/typography override (use governed token)`
        );
      }
    }
  }

  return violations;
}
const NEXT_PUBLIC_ASSIGNMENT = /^(NEXT_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*)$/;
const NEXT_PUBLIC_PREFIX = /^NEXT_PUBLIC_/;

const ALLOWED_KEY_FRAGMENTS = [
  "PUBLISHABLE",
  "ANON",
  "_URL",
  "APP_URL",
  "WEB_URL",
  "API_URL",
  "DOCS_URL",
];

const FORBIDDEN_KEY_FRAGMENTS = [
  "SECRET",
  "PASSWORD",
  "PRIVATE",
  "SERVICE_ROLE",
  "DATABASE",
  "POSTGRES",
  "CONNECTION",
  "JWT",
  "SESSION",
  "SIGNING",
  "STRIPE_SK",
  "API_KEY",
  "ACCESS_TOKEN",
  "REFRESH_TOKEN",
];

const FORBIDDEN_VALUE_PATTERNS = [
  /\bsk_live_[a-zA-Z0-9]+\b/,
  /\bsk_test_[a-zA-Z0-9]+\b/,
  /\bpostgresql:\/\//i,
  /\bmongodb(\+srv)?:\/\//i,
  /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\./,
];

function extractContent(input) {
  const toolInput = input.tool_input ?? input.arguments ?? input.input ?? {};
  const candidates = [
    toolInput.contents,
    toolInput.new_string,
    toolInput.content,
    toolInput.text,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return "";
}

function scanEnvContent(content) {
  const violations = [];

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(NEXT_PUBLIC_ASSIGNMENT);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    const suffix = key.replace(NEXT_PUBLIC_PREFIX, "");
    const allowed = ALLOWED_KEY_FRAGMENTS.some((fragment) =>
      suffix.includes(fragment)
    );

    if (!allowed) {
      for (const fragment of FORBIDDEN_KEY_FRAGMENTS) {
        if (suffix.includes(fragment)) {
          violations.push(`${key} (forbidden key name — use server-only env)`);
          break;
        }
      }
    }

    const value = rawValue.replace(/^["']|["']$/g, "");
    for (const pattern of FORBIDDEN_VALUE_PATTERNS) {
      if (pattern.test(value)) {
        violations.push(`${key} (value looks like a secret — server-only env)`);
        break;
      }
    }
  }

  return violations;
}

const input = parseStdinJson();

if (input === null) {
  log(TAG, "invalid stdin JSON; allowing");
  allow();
}

const repoRoot = resolveRepoRoot();
const relativePath = extractPath(input, repoRoot);

if (hasEnvSyncWorkflow(repoRoot) && isSyncedEnvOutput(relativePath)) {
  log(TAG, `blocked synced env edit: ${relativePath}`);
  deny(
    "This env file is generated by pnpm env:sync. Edit .env.config or .env.secret, then run pnpm env:sync.",
    "Blocked direct edit of synced env output. Edit .env.config or .env.secret, then run pnpm env:sync."
  );
}

if (relativePath && isEditableEnvSource(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const deprecated = findDeprecatedKeys(relativePath, content);

    if (deprecated.length > 0) {
      log(TAG, `flagged deprecated env keys: ${relativePath}`);
      ask(
        `Env edit adds deprecated key(s) in ${relativePath}: ${deprecated.join(", ")}. Approve only if migrating off them.`,
        `Deprecated env keys: ${deprecated.join(", ")}. See .cursor/rules/env-workflow.mdc and scripts/env-utils.mjs. Remove duplicates; run pnpm env:sync after editing sources.`
      );
    }
  }
}

if (relativePath && DESIGN_SYSTEM_UI.test(relativePath)) {
  log(TAG, `flagged design-system edit: ${relativePath}`);
  ask(
    `Edit targets design-system UI primitives (${relativePath}). Approve only if intentional.`,
    "Design-system primitives are protected. Prefer apps/erp wiring or Storybook unless the user approved editing packages/design-system/components/ui/**."
  );
}

if (relativePath && ENV_PATH.test(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const violations = scanEnvContent(content);

    if (violations.length > 0) {
      log(TAG, `flagged NEXT_PUBLIC env edit: ${relativePath}`);
      ask(
        `Env edit may expose secrets via NEXT_PUBLIC_* (${relativePath}). Approve only if values are truly browser-safe.`,
        `NEXT_PUBLIC_* violation: ${violations.join("; ")}. Move secrets to server-only env vars.`
      );
    }
  }
}

// ─── Raw Tailwind guards ─────────────────────────────────────────────────────

if (relativePath && UI_STORY_FILE.test(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const violations = checkRawTailwindInStory(content);

    if (violations.length > 0) {
      log(TAG, `raw Tailwind in story: ${relativePath} (${violations.length})`);
      ask(
        `Story file contains ${violations.length} raw Tailwind violation(s) in ${relativePath}. Approve only if intentional.\n\n${violations.slice(0, 6).join("\n")}${violations.length > 6 ? `\n…and ${violations.length - 6} more` : ""}`,
        `TIP-004: Raw Tailwind in story file. Replace spacing utilities with StoryRow/StoryStack gap/padding props and arbitrary values with governed recipe overrides. See .cursor/rules/no-raw-tailwind.mdc.`
      );
    }
  }
}

if (relativePath && UI_COMPONENT_FILE.test(relativePath) && !UI_STORY_FILE.test(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const violations = checkRawTailwindInComponent(content);

    if (violations.length > 0) {
      log(TAG, `raw Tailwind in component: ${relativePath} (${violations.length})`);
      ask(
        `Governed component contains ${violations.length} raw Tailwind violation(s) in ${relativePath}. Approve only if intentional.\n\n${violations.slice(0, 6).join("\n")}${violations.length > 6 ? `\n…and ${violations.length - 6} more` : ""}`,
        `TIP-001/TIP-004: Raw Tailwind in governed component. All styling must flow through resolvePrimitiveGovernance and the recipe system. See .cursor/rules/no-raw-tailwind.mdc.`
      );
    }
  }
}

// ─── Governed UI consumer layer (appshell, erp app wiring) ───────────────────

if (relativePath && GOVERNED_UI_CONSUMER_PATH.test(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const violations = checkGovernedUiConsumption(content);

    if (violations.length > 0) {
      log(TAG, `governed UI consumption: ${relativePath} (${violations.length})`);
      ask(
        `@afenda/ui consumer file has ${violations.length} TIP-004 violation(s) in ${relativePath}. Approve only if intentional.\n\n${violations.slice(0, 6).join("\n")}${violations.length > 6 ? `\n…and ${violations.length - 6} more` : ""}`,
        `TIP-004: Do not pass className to governed @afenda/ui primitives. Import mapStockButtonProps from @afenda/ui/governance directly — no stock-props wrappers. Put shell layout on plain HTML wrappers. See .cursor/rules/governed-ui-consumption.mdc and .cursor/skills/govern-primitive/SKILL.md.`
      );
    }
  }
}

// ─── CSP third-party script governance (apps/erp) ─────────────────────────────

if (relativePath && CSP_ERP_SOURCE_PATH.test(relativePath)) {
  const content = extractContent(input);

  if (content) {
    const violations = checkCspThirdPartyGovernance(content, relativePath);

    if (violations.length > 0) {
      log(TAG, `CSP third-party: ${relativePath} (${violations.length})`);
      ask(
        `ERP file has ${violations.length} CSP third-party violation(s) in ${relativePath}. Approve only if intentional.\n\n${violations.slice(0, 6).join("\n")}${violations.length > 6 ? `\n…and ${violations.length - 6} more` : ""}`,
        `CSP: Use getCspNonce() + next/script nonce prop and update csp-allowlist.ts. See .cursor/rules/csp-third-party-scripts.mdc and .cursor/skills/csp-third-party/SKILL.md. Run pnpm check:csp-third-party.`
      );
    }
  }
}

allow();
