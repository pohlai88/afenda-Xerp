#!/usr/bin/env tsx
/**
 * JSON export for .mjs governance gates — do not edit registry here.
 */
import {
  COMPOUND_PRIMITIVE_SLUGS,
  PRIMITIVE_EVIDENCE_REGISTRY,
} from "../../../packages/shadcn-studio/src/meta-gates/primitive-evidence.registry.ts";

console.log(
  JSON.stringify({
    registry: PRIMITIVE_EVIDENCE_REGISTRY,
    compoundSlugs: COMPOUND_PRIMITIVE_SLUGS,
  })
);
