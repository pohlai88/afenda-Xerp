"use client";

import { studioThemeConfig } from "../../configs/theme-config";
import { useTheme } from "../../hooks/use-theme";
import type { StudioThemeId, StudioThemeMode } from "../../types/theme";
import { Button } from "../ui/Button";
import { Field, FieldDescription, FieldLabel } from "../ui/Field";
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

const THEME_MODES: readonly {
  readonly label: string;
  readonly value: StudioThemeMode;
}[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

function ThemeRadioGrid<T extends string>({
  legend,
  name,
  onChange,
  options,
  value,
}: {
  readonly legend: string;
  readonly name: string;
  readonly onChange: (value: T) => void;
  readonly options: readonly { label: string; value: T }[];
  readonly value: T;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium">{legend}</legend>
      <RadioGroup
        className="grid grid-cols-3 gap-1"
        onValueChange={(nextValue: string) => onChange(nextValue as T)}
        value={value}
      >
        {options.map((option) => (
          // biome-ignore lint/a11y/noLabelWithoutControl: RadioGroupItem is nested inside label for custom radio styling.
          <label
            className="flex cursor-pointer items-center justify-center rounded-md border border-border px-2 py-2 has-checked:bg-accent"
            key={option.value}
          >
            <RadioGroupItem
              className="sr-only"
              name={name}
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export interface ThemeCustomizerProps {
  readonly className?: string;
}

function isThemeId(value: string): value is StudioThemeId {
  return studioThemeConfig.themes.some((theme) => theme.id === value);
}

export function ThemeCustomizer({ className }: ThemeCustomizerProps) {
  const { mode, resolvedMode, setTheme, themeId } = useTheme();

  const activeTheme =
    studioThemeConfig.themes.find((theme) => theme.id === themeId) ??
    studioThemeConfig.themes[0];
  const activePrimary = activeTheme.tokens[resolvedMode].primary;

  return (
    <section
      aria-label="Theme customizer"
      className={[
        "flex max-h-[min(32rem,80vh)] w-72 flex-col gap-4 overflow-y-auto rounded-md border border-border bg-popover p-4 text-popover-foreground text-sm shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-medium text-lg">Theme Customizer</h2>
          <p className="text-muted-foreground text-sm">
            Theme family and color mode.
          </p>
        </div>
        <Button
          onClick={() =>
            setTheme({
              mode: studioThemeConfig.defaultMode,
              themeId: studioThemeConfig.defaultThemeId,
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          Reset
        </Button>
      </header>

      <Field>
        <FieldLabel htmlFor="theme-customizer-select">Theme</FieldLabel>
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: activePrimary }}
          />
          <Select
            onValueChange={(nextThemeId: string) => {
              if (!isThemeId(nextThemeId)) {
                return;
              }

              setTheme({ themeId: nextThemeId });
            }}
            value={themeId}
          >
            <SelectTrigger className="w-full" id="theme-customizer-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {studioThemeConfig.themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  {theme.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FieldDescription>{activeTheme.description}</FieldDescription>
      </Field>

      <ThemeRadioGrid
        legend="Color Mode"
        name="theme-mode"
        onChange={(value) => setTheme({ mode: value })}
        options={THEME_MODES}
        value={mode}
      />
    </section>
  );
}
