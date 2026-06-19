import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicKey, getSupabasePublicUrl } from "./env";

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabasePublicUrl(), getSupabasePublicKey());
}
