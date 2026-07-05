"use client";

import {
  type StudioContextValue,
  useStudioContext,
} from "../contexts/StudioProvider";

export function useStudio(): StudioContextValue {
  return useStudioContext();
}
