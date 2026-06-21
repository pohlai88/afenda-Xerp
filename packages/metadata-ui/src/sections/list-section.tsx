import type { MetadataSectionProps } from "../contracts/section-renderer.contract.js";
import { MetadataSection } from "./metadata-section.js";

export { MetadataSection } from "./metadata-section.js";

export function ListSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="list" />;
}

export function StatSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="stat" />;
}

export function ChartSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="chart" />;
}

export function FormSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="form" />;
}

export function DetailSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="detail" />;
}

export function AuditSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="audit" />;
}

export function ActionSection(props: Omit<MetadataSectionProps, "type">) {
  return <MetadataSection {...props} type="action" />;
}
