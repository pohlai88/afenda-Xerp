export const TRANSFER_TYPES = ["internal", "external", "reclass"] as const;

export type TransferType = (typeof TRANSFER_TYPES)[number];

export function isTransferType(value: string): value is TransferType {
  return (TRANSFER_TYPES as readonly string[]).includes(value);
}
