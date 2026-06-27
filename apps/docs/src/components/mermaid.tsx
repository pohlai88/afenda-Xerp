"use client";

import { useEffect, useId, useState } from "react";

interface MermaidProps {
  readonly chart: string;
}

/**
 * Renders Mermaid diagrams from `remarkMdxMermaid` code fences.
 * @see https://fumadocs.dev/docs/ui/mermaid
 */
export function Mermaid({ chart }: MermaidProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart(): Promise<void> {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
        });
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Mermaid render failed");
          setSvg(null);
        }
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        {error}
      </pre>
    );
  }

  if (!svg) {
    return (
      <div
        aria-busy="true"
        className="rounded-lg border border-fd-border bg-fd-muted/30 p-4 text-sm text-fd-muted-foreground"
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className="my-4 overflow-x-auto [&_svg]:mx-auto"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted Mermaid SVG output
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
