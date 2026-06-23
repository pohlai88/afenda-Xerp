import type { GovernedSpinnerSize } from "@afenda/ui/governance";
import { useState } from "react";
import { RefreshCwIcon, SaveIcon } from "lucide-react";
import { Button } from "../button";
import { Badge } from "../badge";
import { Spinner } from "../spinner";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

export const SPINNER_SIZE_DEMOS = [
  { size: "xs", label: "xs · 12px" },
  { size: "sm", label: "sm · 16px" },
  { size: "md", label: "md · 20px" },
  { size: "lg", label: "lg · 24px" },
  { size: "xl", label: "xl · 32px" },
] as const satisfies ReadonlyArray<{
  readonly size: GovernedSpinnerSize;
  readonly label: string;
}>;

export function LoadingStatusRow({
  detail,
  label,
  spinnerLabel,
}: {
  readonly detail?: string;
  readonly label: string;
  readonly spinnerLabel?: string;
}) {
  return (
    <StoryRow align="center" gap="sm">
      <Spinner {...(spinnerLabel ? { "aria-label": spinnerLabel } : {})} />
      <StoryStack gap="xs">
        <span className="font-medium text-sm">{label}</span>
        {detail ? (
          <span className="text-muted-foreground text-xs">{detail}</span>
        ) : null}
      </StoryStack>
    </StoryRow>
  );
}

export function CenteredLoadingPanel({
  description,
  title,
}: {
  readonly description?: string;
  readonly title: string;
}) {
  return (
    <StoryStack className="items-center" gap="sm">
      <Spinner aria-label={title} />
      <span className="font-medium text-sm">{title}</span>
      {description ? (
        <span className="text-center text-muted-foreground text-xs">
          {description}
        </span>
      ) : null}
    </StoryStack>
  );
}

export function SimulatedSaveButton() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => setSaving(false), 2200);
  };

  return (
    <Button
      disabled={saving}
      emphasis="solid"
      intent="primary"
      onClick={handleSave}
      {...(saving ? { state: "loading" as const } : {})}
    >
      {saving ? <Spinner aria-label="Saving changes" /> : <SaveIcon />}
      {saving ? "Saving…" : "Save changes"}
    </Button>
  );
}

export function SimulatedRefreshPanel() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">Open purchase orders</span>
            <span className="text-muted-foreground text-xs">
              {refreshing
                ? "Refreshing from procurement service…"
                : "Last synced 2 minutes ago"}
            </span>
          </StoryStack>
          <Button
            disabled={refreshing}
            emphasis="outline"
            intent="secondary"
            onClick={handleRefresh}
            size="sm"
          >
            {refreshing ? (
              <Spinner aria-label="Refreshing purchase orders" />
            ) : (
              <RefreshCwIcon />
            )}
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        </StoryRow>
        {refreshing ? (
          <StoryRow align="center" gap="sm" justify="center" paddingY="md">
            <Spinner aria-label="Loading purchase orders" />
            <span className="text-muted-foreground text-sm">Loading rows…</span>
          </StoryRow>
        ) : (
          <Badge emphasis="soft" tone="neutral">
            42 open POs
          </Badge>
        )}
      </StoryStack>
    </StoryFrame>
  );
}
