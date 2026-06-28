export const TRANSPORT_MODES = [
  "road",
  "rail",
  "air",
  "sea",
  "parcel",
] as const;

export type TransportMode = (typeof TRANSPORT_MODES)[number];

export function isTransportMode(value: string): value is TransportMode {
  return (TRANSPORT_MODES as readonly string[]).includes(value);
}
