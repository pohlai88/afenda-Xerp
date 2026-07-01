import * as React from "react";

/** Matches Tailwind `md` breakpoint (768px). */
const MOBILE_BREAKPOINT = 768;

/**
 * Sidebar layout helper — returns `false` until mount to avoid SSR hydration mismatch.
 * After `useEffect`, reflects `(max-width: 767px)` media query via `matchMedia`.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile ?? false;
}
