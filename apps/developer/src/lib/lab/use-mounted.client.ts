"use client";

import { useEffect, useState } from "react";

/**
 * Returns false on SSR and the first client render, then true after mount.
 * Use before binding storage-backed theme/settings or matchMedia state to DOM.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
