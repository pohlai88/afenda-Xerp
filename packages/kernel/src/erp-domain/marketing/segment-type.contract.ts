export const SEGMENT_TYPES = ["static", "dynamic", "lookalike"] as const;

export type SegmentType = (typeof SEGMENT_TYPES)[number];

export function isSegmentType(value: string): value is SegmentType {
  return (SEGMENT_TYPES as readonly string[]).includes(value);
}
