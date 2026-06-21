import {
  ActionSection,
  AuditSection,
  ChartSection,
  DetailSection,
  FormSection,
  ListSection,
  StatSection,
} from "../sections/index.js";
import { createSectionRenderer } from "./create-section-renderer.js";

export const listRenderer = createSectionRenderer({
  sectionType: "list",
  label: "List Renderer",
  defaultIdentity: { id: "metadata-list", title: "List" },
  SectionComponent: ListSection,
});

export const statRenderer = createSectionRenderer({
  sectionType: "stat",
  label: "Stat Renderer",
  defaultIdentity: { id: "metadata-stat", title: "Stat" },
  SectionComponent: StatSection,
});

export const chartRenderer = createSectionRenderer({
  sectionType: "chart",
  label: "Chart Renderer",
  defaultIdentity: { id: "metadata-chart", title: "Chart" },
  SectionComponent: ChartSection,
});

export const formRenderer = createSectionRenderer({
  sectionType: "form",
  label: "Form Renderer",
  defaultIdentity: { id: "metadata-form", title: "Form" },
  SectionComponent: FormSection,
});

export const detailRenderer = createSectionRenderer({
  sectionType: "detail",
  label: "Detail Renderer",
  defaultIdentity: { id: "metadata-detail", title: "Detail" },
  SectionComponent: DetailSection,
});

export const auditRenderer = createSectionRenderer({
  sectionType: "audit",
  label: "Audit Renderer",
  defaultIdentity: { id: "metadata-audit", title: "Audit" },
  SectionComponent: AuditSection,
});

export const actionRenderer = createSectionRenderer({
  sectionType: "action",
  label: "Action Renderer",
  defaultIdentity: { id: "metadata-action", title: "Actions" },
  SectionComponent: ActionSection,
});

export const defaultMetadataRenderers = [
  listRenderer,
  statRenderer,
  chartRenderer,
  formRenderer,
  detailRenderer,
  auditRenderer,
  actionRenderer,
] as const;
