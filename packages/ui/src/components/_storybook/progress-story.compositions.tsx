import { useEffect, useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Progress } from "../progress";
import { Spinner } from "../spinner";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

export function LabeledProgress({
  detail,
  label,
  value,
}: {
  readonly detail?: string;
  readonly label: string;
  readonly value: number;
}) {
  return (
    <StoryStack gap="xs">
      <StoryRow justify="between">
        <span className="font-medium text-sm">{label}</span>
        <span className="tabular-nums text-muted-foreground text-xs">
          {detail ?? `${value}%`}
        </span>
      </StoryRow>
      <Progress value={value} />
    </StoryStack>
  );
}

export function stepBadgeTone(pct: number): "success" | "warning" | "neutral" {
  if (pct === 100) {
    return "success";
  }
  if (pct > 0) {
    return "warning";
  }
  return "neutral";
}

export function FileUploadDemo() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  const start = () => {
    setProgress(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) {
      return;
    }
    if (progress >= 100) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(
      () => setProgress((current) => Math.min(current + 5, 100)),
      100
    );
    return () => clearTimeout(timer);
  }, [running, progress]);

  return (
    <StoryFrame width="lg">
      <StoryStack
        className="rounded-md border border-border"
        gap="md"
        padding="lg"
      >
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium text-sm">payroll_june_2026.xlsx</span>
            <span className="tabular-nums text-muted-foreground text-xs">
              {progress < 100 ? `Uploading… ${progress}%` : "Upload complete"}
            </span>
          </StoryStack>
          {progress < 100 ? (
            <Spinner />
          ) : (
            <Badge emphasis="soft" tone="success">
              Done
            </Badge>
          )}
        </StoryRow>
        <Progress value={progress} />
        <StoryRow justify="end">
          <Button emphasis="ghost" intent="primary" onClick={start} size="sm">
            {running ? "Uploading…" : "Restart demo"}
          </Button>
        </StoryRow>
      </StoryStack>
    </StoryFrame>
  );
}
