// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React context filenames.
"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { studioThemeConfig } from "../configs/theme-config";
import type {
  StudioResolvedThemeMode,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeState,
  StudioThemeUpdate,
} from "../types/theme";

export interface ThemeContextValue extends StudioThemeState {
  readonly setTheme: (update: StudioThemeUpdate) => void;
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly initialMode?: StudioThemeMode;
  readonly initialThemeId?: StudioThemeId;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystemMode(): StudioResolvedThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveMode(mode: StudioThemeMode): StudioResolvedThemeMode {
  return mode === "system" ? resolveSystemMode() : mode;
}

function resolveInitialMode(mode: StudioThemeMode): StudioResolvedThemeMode {
  return mode === "dark" ? "dark" : "light";
}

function applyTheme(state: StudioThemeState): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.setAttribute(studioThemeConfig.themeAttribute, state.themeId);
  root.classList.toggle(
    studioThemeConfig.darkClassName,
    state.resolvedMode === "dark"
  );
}

function readStoredTheme(): Partial<StudioThemeState> {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = window.localStorage.getItem(studioThemeConfig.storageKey);

  if (!stored) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "themeId" in parsed &&
      "mode" in parsed &&
      isThemeId(parsed.themeId) &&
      isThemeMode(parsed.mode)
    ) {
      return {
        mode: parsed.mode,
        themeId: parsed.themeId,
      };
    }
  } catch {
    return {};
  }

  return {};
}

function persistTheme(state: StudioThemeState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    studioThemeConfig.storageKey,
    JSON.stringify({
      mode: state.mode,
      themeId: state.themeId,
    })
  );
}

function isThemeId(value: unknown): value is StudioThemeId {
  return studioThemeConfig.themes.some((theme) => theme.id === value);
}

function isThemeMode(value: unknown): value is StudioThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function createThemeState(
  themeId: StudioThemeId,
  mode: StudioThemeMode,
  resolveThemeMode: (
    mode: StudioThemeMode
  ) => StudioResolvedThemeMode = resolveMode
): StudioThemeState {
  return {
    mode,
    resolvedMode: resolveThemeMode(mode),
    themeId,
  };
}

export function ThemeProvider({
  children,
  initialMode = studioThemeConfig.defaultMode,
  initialThemeId = studioThemeConfig.defaultThemeId,
}: ThemeProviderProps) {
  const hasLoadedStoredThemeRef = useRef(false);
  const [themeState, setThemeState] = useState<StudioThemeState>(() =>
    createThemeState(initialThemeId, initialMode, resolveInitialMode)
  );

  useEffect(() => {
    const stored = readStoredTheme();
    hasLoadedStoredThemeRef.current = true;

    setThemeState((current) => {
      const nextThemeId = stored.themeId ?? current.themeId;
      const nextMode = stored.mode ?? current.mode;

      return createThemeState(nextThemeId, nextMode);
    });
  }, []);

  useEffect(() => {
    if (themeState.mode !== "system" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (): void => {
      setThemeState((current) => {
        if (current.mode !== "system") {
          return current;
        }

        return {
          ...current,
          resolvedMode: mediaQuery.matches ? "dark" : "light",
        };
      });
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [themeState.mode]);

  useEffect(() => {
    if (!hasLoadedStoredThemeRef.current) {
      return;
    }

    applyTheme(themeState);
    persistTheme(themeState);
  }, [themeState]);

  const setTheme = useCallback((update: StudioThemeUpdate) => {
    setThemeState((current) =>
      createThemeState(
        update.themeId ?? current.themeId,
        update.mode ?? current.mode
      )
    );
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      ...themeState,
      setTheme,
    }),
    [setTheme, themeState]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
