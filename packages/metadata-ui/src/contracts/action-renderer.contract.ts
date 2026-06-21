export type MetadataActionKind = "button" | "destructive" | "link" | "menu";

export interface MetadataActionConfirm {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
}

export interface MetadataAction {
  readonly key: string;
  readonly label: string;
  readonly description?: string;
  readonly kind: MetadataActionKind;
  readonly href?: string;
  readonly disabled?: boolean;
  readonly hidden?: boolean;
  readonly reason?: string;
  readonly confirm?: MetadataActionConfirm;
}

export interface MetadataActionHandler {
  readonly (actionKey: string): void;
}
