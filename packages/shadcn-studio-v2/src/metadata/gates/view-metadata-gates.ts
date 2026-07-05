import type {
  StudioAuthViewMetadata,
  StudioMetricWidgetMetadata,
  StudioPageViewMetadata,
  StudioViewMetadata,
} from "../contracts/view-metadata";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isAuthMetadata(value: unknown): value is StudioAuthViewMetadata {
  return (
    isRecord(value) && value["kind"] === "auth" && isString(value["title"])
  );
}

function isPageMetadata(value: unknown): value is StudioPageViewMetadata {
  return (
    isRecord(value) && value["kind"] === "page" && isString(value["title"])
  );
}

function isMetricWidgetMetadata(
  value: unknown
): value is StudioMetricWidgetMetadata {
  return (
    isRecord(value) &&
    value["kind"] === "widget" &&
    value["widget"] === "metric" &&
    isString(value["label"]) &&
    isString(value["value"])
  );
}

export function isStudioViewMetadata(
  value: unknown
): value is StudioViewMetadata {
  return (
    isAuthMetadata(value) ||
    isPageMetadata(value) ||
    isMetricWidgetMetadata(value)
  );
}

export function assertStudioViewMetadata(
  value: unknown
): asserts value is StudioViewMetadata {
  if (!isStudioViewMetadata(value)) {
    throw new Error("Invalid shadcn-studio-v2 view metadata.");
  }
}
