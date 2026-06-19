import { requireAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";

export async function requireSession() {
  return requireAfendaAuthSession(await headers());
}
