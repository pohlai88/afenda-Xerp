"use client";

import {
  type StudioContextValue,
  useStudioContext,
} from "../contexts/studio-provider";

export function useStudio(): StudioContextValue {
  return useStudioContext();
}
