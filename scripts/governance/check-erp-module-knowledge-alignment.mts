#!/usr/bin/env tsx
import { collectModuleReadinessFailures } from "../../packages/erp-module-foundation/src/assert-module-readiness.js";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-knowledge-alignment";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundle = PROCUREMENT_FOUNDATION_BUNDLE;

  for (const term of bundle.knowledge.terms) {
    if (term.status === "accepted" && !term.atomId) {
      violations.push({
        rule: "knowledge-accepted-atom",
        file: GATE,
        message: `term "${term.term}" is accepted but missing atomId`,
      });
    }
    if (term.status === "wire_only" && !term.wireArtifact) {
      violations.push({
        rule: "knowledge-wire-artifact",
        file: GATE,
        message: `term "${term.term}" is wire_only but missing wireArtifact`,
      });
    }
  }

  if (bundle.module.runtimeStatus === "foundation_authorized") {
    const pendingBusinessTerms = bundle.knowledge.terms.filter(
      (term) => term.status === "wire_only" || term.status === "missing"
    );
    if (pendingBusinessTerms.length === 0) {
      violations.push({
        rule: "law-k6-foundation-honesty",
        file: GATE,
        message:
          "foundation_authorized bundle must retain wire_only/missing business terms until PAS-004 promotes meaning (LAW K6)",
      });
    }

    const acceptedWithoutRuntime = bundle.knowledge.terms.filter(
      (term) => term.status === "accepted" && term.atomId
    );
    if (acceptedWithoutRuntime.length > 0) {
      console.log(
        `  LAW K6: ${acceptedWithoutRuntime.length} accepted term(s) — meaning only; semantic runtime gated by ${bundle.module.runtimePackage}`
      );
    }
  }

  const knowledgeFailures = collectModuleReadinessFailures(bundle).filter((f) =>
    f.includes("knowledge")
  );
  for (const failure of knowledgeFailures) {
    violations.push({
      rule: "knowledge-readiness",
      file: GATE,
      message: failure,
    });
  }

  return violations;
}

reportViolations(GATE, run());
