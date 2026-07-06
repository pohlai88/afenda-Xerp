"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CANONICAL_THEME_TOKEN_NAMES,
  studioThemeConfig,
} from "../configs/theme-config";
import type {
  StudioResolvedThemeMode,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
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
  readonly lockedThemeId?: StudioThemeId;
  readonly storageKey?: string | null;
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

function findThemeOption(themeId: StudioThemeId): StudioThemeOption {
  const theme = studioThemeConfig.themes.find(
    (option) => option.id === themeId
  );

  return theme ?? studioThemeConfig.themes[0];
}

function clearThemeTokenStyles(root: HTMLElement): void {
  for (const tokenName of CANONICAL_THEME_TOKEN_NAMES) {
    root.style.removeProperty(`--${tokenName}`);
  }
}

function applyTheme(state: StudioThemeState): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle(
    studioThemeConfig.darkClassName,
    state.resolvedMode === "dark"
  );
  clearThemeTokenStyles(root);

  if (state.themeId === studioThemeConfig.defaultThemeId) {
    return;
  }

  const theme = findThemeOption(state.themeId);
  const tokens = theme.tokens[state.resolvedMode];

  for (const tokenName of CANONICAL_THEME_TOKEN_NAMES) {
    root.style.setProperty(`--${tokenName}`, tokens[tokenName]);
  }
}

function readStoredTheme(
  storageKey: string | null,
  lockedThemeId: StudioThemeId | undefined
): Partial<StudioThemeState> {
  if (typeof window === "undefined" || storageKey === null) {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return {};
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "mode" in parsed &&
      isThemeMode(parsed.mode)
    ) {
      const themeId =
        lockedThemeId === undefined &&
        "themeId" in parsed &&
        isThemeId(parsed.themeId)
          ? parsed.themeId
          : undefined;

      return {
        mode: parsed.mode,
        ...(themeId === undefined ? {} : { themeId }),
      };
    }
  } catch {
    return {};
  }

  return {};
}

function persistTheme(
  state: StudioThemeState,
  storageKey: string | null,
  lockedThemeId: StudioThemeId | undefined
): void {
  if (typeof window === "undefined" || storageKey === null) {
    return;
  }

  try {
    const payload =
      lockedThemeId === undefined
        ? {
            mode: state.mode,
            themeId: state.themeId,
          }
        : {
            mode: state.mode,
          };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Storage is optional; DOM theme state still applies.
  }
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

function createInitialThemeState(
  initialThemeId: StudioThemeId,
  initialMode: StudioThemeMode,
  storageKey: string | null,
  lockedThemeId: StudioThemeId | undefined
): StudioThemeState {
  const stored = readStoredTheme(storageKey, lockedThemeId);

  return createThemeState(
    lockedThemeId ?? stored.themeId ?? initialThemeId,
    stored.mode ?? initialMode
  );
}

export function ThemeProvider({
  children,
  initialMode = studioThemeConfig.defaultMode,
  initialThemeId = studioThemeConfig.defaultThemeId,
  lockedThemeId,
  storageKey = studioThemeConfig.storageKey,
}: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<StudioThemeState>(() =>
    createInitialThemeState(
      initialThemeId,
      initialMode,
      storageKey,
      lockedThemeId
    )
  );

  useEffect(() => {
    if (lockedThemeId === undefined) {
      return;
    }

    setThemeState((current) => {
      if (current.themeId === lockedThemeId) {
        return current;
      }

      return createThemeState(lockedThemeId, current.mode);
    });
  }, [lockedThemeId]);

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
    applyTheme(themeState);
    persistTheme(themeState, storageKey, lockedThemeId);
  }, [lockedThemeId, storageKey, themeState]);

  const setTheme = useCallback(
    (update: StudioThemeUpdate) => {
      setThemeState((current) => {
        const nextThemeId =
          lockedThemeId ??
          (isThemeId(update.themeId) ? update.themeId : current.themeId);
        const nextMode = isThemeMode(update.mode) ? update.mode : current.mode;

        return createThemeState(nextThemeId, nextMode);
      });
    },
    [lockedThemeId]
  );

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
