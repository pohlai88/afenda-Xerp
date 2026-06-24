import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface DocsGuideCardItem {
  readonly badge?: string;
  readonly description: string;
  readonly href: string;
  readonly icon?: LucideIcon;
  readonly title: string;
}

export type DocsGuideCardGridVariant = "grid" | "compact" | "featured";

export interface DocsGuideCardGridProps {
  readonly eyebrow?: string;
  readonly heading?: string;
  readonly items: readonly DocsGuideCardItem[];
  readonly lead?: string;
  readonly variant?: DocsGuideCardGridVariant;
}

export interface DocsFeatureStripItem {
  readonly description: string;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly tone?: "neutral" | "info" | "success";
}

export type DocsFeatureStripVariant = "bordered" | "plain" | "dense";

export interface DocsFeatureStripProps {
  readonly items: readonly DocsFeatureStripItem[];
  readonly subtitle?: string;
  readonly title: string;
  readonly variant?: DocsFeatureStripVariant;
}

export interface DocsStepsPanelStep {
  readonly description: string;
  readonly title: string;
}

export type DocsStepsPanelVariant = "numbered" | "timeline" | "compact";

export interface DocsStepsPanelProps {
  readonly lead?: string;
  readonly steps: readonly DocsStepsPanelStep[];
  readonly title: string;
  readonly variant?: DocsStepsPanelVariant;
}

export type DocsCalloutTone = "note" | "info" | "warn" | "success";

export type DocsCalloutVariant = "rail" | "soft" | "banner";

export interface DocsCalloutProps {
  readonly children?: ReactNode;
  readonly icon?: LucideIcon;
  readonly title?: string;
  readonly tone?: DocsCalloutTone;
  readonly variant?: DocsCalloutVariant;
}

export type DocsAnnouncementBarVariant = "accent" | "neutral" | "warn";

export interface DocsAnnouncementBarProps {
  readonly actionHref?: string;
  readonly actionLabel?: string;
  readonly message: ReactNode;
  readonly variant?: DocsAnnouncementBarVariant;
}

export interface DocsAccordionPanelItem {
  readonly content: ReactNode;
  readonly title: string;
}

export type DocsAccordionPanelVariant = "contained" | "separated" | "flush";

export interface DocsAccordionPanelProps {
  readonly defaultOpenItems?: readonly string[];
  readonly items: readonly DocsAccordionPanelItem[];
  readonly variant?: DocsAccordionPanelVariant;
}

export type DocsCodePanelVariant = "panel" | "inline";

export interface DocsCodePanelProps {
  readonly code: string;
  readonly language?: string;
  readonly title?: string;
  readonly variant?: DocsCodePanelVariant;
}

export interface DocsFileTreeNode {
  readonly children?: readonly DocsFileTreeNode[];
  readonly kind: "file" | "folder";
  readonly muted?: boolean;
  readonly name: string;
}

export type DocsFileTreeVariant = "default" | "compact";

export interface DocsFileTreeProps {
  readonly nodes: readonly DocsFileTreeNode[];
  readonly variant?: DocsFileTreeVariant;
}

export interface DocsInlineTocItem {
  readonly depth: number;
  readonly title: string;
  readonly url: string;
}

export type DocsInlineTocVariant = "card" | "rail" | "minimal";

export interface DocsInlineTocProps {
  readonly items: readonly DocsInlineTocItem[];
  readonly title?: string;
  readonly variant?: DocsInlineTocVariant;
}

export interface DocsTabbedPanelItem {
  readonly content: ReactNode;
  readonly label: string;
  readonly value: string;
}

export interface DocsTabbedPanelProps {
  readonly defaultValue?: string;
  readonly items: readonly DocsTabbedPanelItem[];
}

export interface DocsPropTableRow {
  readonly defaultValue?: string;
  readonly description?: string;
  readonly name: string;
  readonly required?: boolean;
  readonly type: string;
}

export type DocsPropTableVariant = "default" | "compact";

export interface DocsPropTableProps {
  readonly caption?: string;
  readonly rows: readonly DocsPropTableRow[];
  readonly variant?: DocsPropTableVariant;
}
