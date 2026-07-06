export {
  defineAuthViewMetadata,
  defineEvidenceWidgetMetadata,
  defineMetricWidgetMetadata,
  definePageViewMetadata,
} from "./metadata/builders/view-builders";
export type {
  StudioAuthViewMetadata,
  StudioEvidenceWidgetItemMetadata,
  StudioEvidenceWidgetMetadata,
  StudioMetadataAction,
  StudioMetadataActionVariant,
  StudioMetadataMetricTone,
  StudioMetadataNavigationItem,
  StudioMetadataViewKind,
  StudioMetricWidgetMetadata,
  StudioPageViewMetadata,
  StudioViewMetadata,
} from "./metadata/contracts/view-metadata";
export {
  assertStudioViewMetadata,
  isStudioViewMetadata,
} from "./metadata/gates/view-metadata-gates";
export {
  type StudioMetadataLaneRegistration,
  studioMetadataLaneRegistry,
} from "./metadata/registries/view-metadata-registry";
export {
  getWorkflowBoardHostMapping,
  listBoardHostedWorkflowSurfaces,
  listWorkflowBoardHostMappings,
  WORKFLOW_BOARD_MANIFEST_DECISION,
  type WorkflowBoardHostMapping,
  type WorkflowBoardHostSurface,
  workflowBoardHostMappingRegistry,
} from "./metadata/registries/workflow-board-host-mapping";
export {
  resolveWorkflowBoardLayoutHint,
  type WorkflowBoardLayoutHint,
  type WorkflowBoardLayoutHintSource,
} from "./metadata/registries/workflow-board-manifest-resolution";
export {
  getWorkspaceBoardManifestByKind,
  listWorkspaceBoardManifestKinds,
  type WorkspaceBoardManifestKind,
  workspaceBoardManifestRegistry,
} from "./metadata/registries/workspace-board-manifest-registry";
