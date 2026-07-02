import type { ShellSlug } from "@afenda/shadcn-studio";

export function resolveShellSlugFromPathname(pathname: string): ShellSlug {
  if (pathname.startsWith("/modules/crm")) {
    return "crm-shell";
  }

  if (pathname.startsWith("/modules/ai")) {
    return "ai-shell";
  }

  return "admincn";
}
