/**
 * Shared Step 1 glossary-first enforcement (multi-tenancy.md §484–500).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES,
  MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_SECTION_PATTERN,
  MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE,
  MULTI_TENANCY_GLOSSARY_PATH,
  MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS,
} from "../multi-tenancy-glossary-first-registry.mts";

export interface GlossaryFirstEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function splitGlossarySections(content: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = content.split(/^## /m);

  for (const part of parts.slice(1)) {
    const newlineIndex = part.indexOf("\n");
    if (newlineIndex === -1) {
      continue;
    }

    const title = part.slice(0, newlineIndex).trim();
    const body = part.slice(newlineIndex + 1);
    sections.set(title, body);
  }

  return sections;
}

function countDoNotConfuseNotes(content: string): number {
  const matches = content.match(
    new RegExp(
      MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_SECTION_PATTERN.source,
      "gi"
    )
  );
  return matches?.length ?? 0;
}

function headingToSectionTitle(heading: string): string {
  return heading.replace(/^##\s+/, "").trim();
}

export function collectGlossaryFirstViolations(
  repoRoot: string
): GlossaryFirstEnforcementViolation[] {
  const violations: GlossaryFirstEnforcementViolation[] = [];
  const glossaryPath = join(repoRoot, MULTI_TENANCY_GLOSSARY_PATH);

  if (!existsSync(glossaryPath)) {
    violations.push({
      rule: "glossary-missing",
      file: glossaryPath,
      message: `${MULTI_TENANCY_GLOSSARY_PATH} is required (Step 1 — Glossary first)`,
    });
    return violations;
  }

  const content = readFileSync(glossaryPath, "utf8");
  const sections = splitGlossarySections(content);

  for (const heading of MULTI_TENANCY_GLOSSARY_REQUIRED_HEADINGS) {
    if (!content.includes(heading)) {
      violations.push({
        rule: "glossary-heading-missing",
        file: glossaryPath,
        message: `Glossary missing required heading: ${heading}`,
      });
      continue;
    }

    const sectionTitle = headingToSectionTitle(heading);
    const sectionBody = sections.get(sectionTitle);

    if (sectionBody === undefined) {
      violations.push({
        rule: "glossary-section-parse",
        file: glossaryPath,
        message: `Unable to parse glossary section for: ${heading}`,
      });
      continue;
    }

    if (
      !MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_SECTION_PATTERN.test(sectionBody)
    ) {
      violations.push({
        rule: "glossary-term-do-not-confuse",
        file: glossaryPath,
        message: `${heading} must include a do-not-confuse boundary note (Step 1 §500)`,
      });
    }
  }

  for (const phrase of MULTI_TENANCY_GLOSSARY_DO_NOT_CONFUSE_REQUIRED_PHRASES) {
    if (!content.includes(phrase)) {
      violations.push({
        rule: "glossary-do-not-confuse-phrase",
        file: glossaryPath,
        message: `Glossary missing required do-not-confuse phrase: ${phrase}`,
      });
    }
  }

  const doNotConfuseCount = countDoNotConfuseNotes(content);
  if (doNotConfuseCount < MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE) {
    violations.push({
      rule: "glossary-do-not-confuse-count",
      file: glossaryPath,
      message: `Glossary must include do-not-confuse notes on all ${MULTI_TENANCY_GLOSSARY_MIN_DO_NOT_CONFUSE} Step 1 terms (found ${doNotConfuseCount})`,
    });
  }

  return violations;
}
