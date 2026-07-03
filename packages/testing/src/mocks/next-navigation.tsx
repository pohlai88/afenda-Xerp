/** Vitest / Storybook stand-in for `next/navigation` App Router hooks. */

export function useRouter() {
  return {
    back: () => undefined,
    forward: () => undefined,
    prefetch: () => undefined,
    push: () => undefined,
    refresh: () => undefined,
    replace: () => undefined,
  };
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams(): Record<string, string | string[]> {
  return {};
}

export function useSelectedLayoutSegment() {
  return null;
}

export function useSelectedLayoutSegments() {
  return [] as string[];
}

export function redirect(url: string): never {
  throw new Error(`redirect: ${url}`);
}

export function notFound(): never {
  throw new Error("notFound");
}

export function permanentRedirect(url: string): never {
  throw new Error(`permanentRedirect: ${url}`);
}
