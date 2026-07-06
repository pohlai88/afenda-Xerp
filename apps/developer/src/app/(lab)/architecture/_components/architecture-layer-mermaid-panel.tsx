"use client";

import { useEffect, useId, useState } from "react";

interface ArchitectureLayerMermaidPanelProps {
  readonly chart: string;
}

export function ArchitectureLayerMermaidPanel({
  chart,
}: ArchitectureLayerMermaidPanelProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart(): Promise<void> {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          securityLevel: "strict",
          startOnLoad: false,
          theme: "neutral",
        });
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error ? cause.message : "Mermaid render failed"
          );
          setSvg(null);
        }
      }
    }

    const task = renderChart();

    return () => {
      cancelled = true;
      task.finally(() => undefined);
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-destructive text-sm">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        aria-busy="true"
        className="rounded-lg border bg-muted/30 p-4 text-muted-foreground text-sm"
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border bg-card p-4 [&_svg]:mx-auto"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Mermaid SVG output
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
