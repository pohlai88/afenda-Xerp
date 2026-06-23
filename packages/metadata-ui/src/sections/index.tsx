import type { SectionType } from "@afenda/metadata";

import type { MetadataSpecificSectionProps } from "../contracts/section.contract.js";
import { MetadataSection } from "./metadata-section.js";

export type {
  MetadataSectionProps,
  MetadataSpecificSectionProps,
} from "../contracts/section.contract.js";
export { MetadataSection } from "./metadata-section.js";

const LIST_SECTION_TYPE = "list" satisfies SectionType;
const STAT_SECTION_TYPE = "stat" satisfies SectionType;
const CHART_SECTION_TYPE = "chart" satisfies SectionType;
const FORM_SECTION_TYPE = "form" satisfies SectionType;
const DETAIL_SECTION_TYPE = "detail" satisfies SectionType;
const AUDIT_SECTION_TYPE = "audit" satisfies SectionType;
const ACTION_SECTION_TYPE = "action" satisfies SectionType;

export function ListSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={LIST_SECTION_TYPE} />;
}

export function StatSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={STAT_SECTION_TYPE} />;
}

export function ChartSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={CHART_SECTION_TYPE} />;
}

export function FormSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={FORM_SECTION_TYPE} />;
}

export function DetailSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={DETAIL_SECTION_TYPE} />;
}

export function AuditSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={AUDIT_SECTION_TYPE} />;
}

export function ActionSection(props: MetadataSpecificSectionProps) {
  return <MetadataSection {...props} type={ACTION_SECTION_TYPE} />;
}
