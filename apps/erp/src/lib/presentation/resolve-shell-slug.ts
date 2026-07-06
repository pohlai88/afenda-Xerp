/** Reserved ERP presentation shell slug — v2 ships AppShell01 only (Lane B-06). */
export type ErpPresentationShellSlug = "admincn" | "ai-shell" | "crm-shell";

export function resolveShellSlugFromPathname(
  pathname: string
): ErpPresentationShellSlug {
  if (pathname.startsWith("/modules/crm")) {
    return "crm-shell";
  }

  if (pathname.startsWith("/modules/ai")) {
    return "ai-shell";
  }

  return "admincn";
}
