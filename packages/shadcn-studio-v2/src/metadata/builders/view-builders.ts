import type {
  StudioAuthViewMetadata,
  StudioMetricWidgetMetadata,
  StudioPageViewMetadata,
} from "../contracts/view-metadata";

export function defineAuthViewMetadata(
  metadata: StudioAuthViewMetadata
): StudioAuthViewMetadata {
  return metadata;
}

export function definePageViewMetadata(
  metadata: StudioPageViewMetadata
): StudioPageViewMetadata {
  return metadata;
}

export function defineMetricWidgetMetadata(
  metadata: StudioMetricWidgetMetadata
): StudioMetricWidgetMetadata {
  return metadata;
}
