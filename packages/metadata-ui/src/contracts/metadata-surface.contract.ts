import type { MetadataActionContract } from "./metadata-action.contract";
import type { MetadataAuditPanelContract } from "./metadata-audit-panel.contract";
import type { MetadataLayoutContract } from "./metadata-layout.contract";
import type { MetadataSectionContract } from "./metadata-section.contract";
import type { MetadataStateContract } from "./metadata-state.contract";

export interface MetadataSurfaceContract {
  readonly actions: readonly MetadataActionContract[];
  readonly auditPanel?: MetadataAuditPanelContract;
  readonly description?: string;
  readonly id: string;
  readonly layout: MetadataLayoutContract;
  readonly sections: readonly MetadataSectionContract[];
  readonly state: MetadataStateContract;
  readonly title: string;
}
