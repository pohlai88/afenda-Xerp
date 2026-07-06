export {
  defineAuthViewMetadata,
  defineMetricWidgetMetadata,
  definePageViewMetadata,
} from "./metadata/builders/view-builders";
export type {
  StudioAuthViewMetadata,
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
