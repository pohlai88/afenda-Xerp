import {
  ENTERPRISE_ID_FAMILY_PREFIXES,
  type EnterpriseIdFamilyKey,
} from "./enterprise-id-patterns.js";

const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(now: number): string {
  let time = now;
  let result = "";
  for (let index = 0; index < 10; index += 1) {
    result = ENCODING[time % 32]! + result;
    time = Math.floor(time / 32);
  }
  return result;
}

function encodeRandom(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let index = 0; index < 16; index += 1) {
    result += ENCODING[bytes[index % 10]! % 32]!;
  }
  return result;
}

/** Zero-dependency Crockford ULID body — parity with `@afenda/kernel` generator. */
export function generateUlidBody(nowMs: number = Date.now()): string {
  return `${encodeTime(nowMs)}${encodeRandom()}`;
}

/** Governed write-path enterprise ID — never use SQL concat for backfill. */
export function createEnterpriseId(family: EnterpriseIdFamilyKey): string {
  const prefix = ENTERPRISE_ID_FAMILY_PREFIXES[family];
  return `${prefix}_${generateUlidBody()}`;
}
