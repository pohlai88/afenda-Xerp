"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { codeToHtml } from "shiki";
import type { BundledLanguage } from "shiki";
import * as React from "react";
import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "../../tabs";

export type StorybookCodeBlockFile = {
  readonly filename: string;
  readonly code: string;
  readonly language?: BundledLanguage;
  readonly highlightLines?: readonly number[];
  readonly showLineNumbers?: boolean;
};

export type StorybookCodeBlockProps = {
  readonly code?: string;
  readonly language?: BundledLanguage;
  readonly filename?: string;
  readonly files?: readonly StorybookCodeBlockFile[];
  readonly highlightLines?: readonly number[];
  readonly showLineNumbers?: boolean;
  readonly width?: "md" | "lg" | "xl";
};

function splitShikiLines(html: string): string[] {
  const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
  if (!match?.[1]) return [html];

  const lines = match[1].split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

async function highlightCode(
  code: string,
  lang: BundledLanguage = "tsx"
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
    });
  } catch {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  }
}

function fallbackCopy(text: string): void {
  const el = document.createElement("textarea");
  el.value = text;
  el.style.cssText = "position:fixed;top:-9999px;left:-9999px";
  document.body.appendChild(el);
  el.focus();
  el.select();
  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(el);
  }
}

function StorybookCodeBlockCopyButton({ code }: { readonly code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    if (typeof navigator === "undefined") return;

    const markCopied = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    };

    if (
      navigator.clipboard &&
      typeof window !== "undefined" &&
      window.isSecureContext
    ) {
      navigator.clipboard
        .writeText(code)
        .then(markCopied)
        .catch(() => {
          fallbackCopy(code);
          markCopied();
        });
    } else {
      fallbackCopy(code);
      markCopied();
    }
  }, [code]);

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className="afenda-storybook-code-block__copy"
      data-slot="code-block-copy"
      onClick={handleCopy}
      type="button"
    >
      {copied ? (
        <CheckIcon aria-hidden="true" size={14} strokeWidth={2} />
      ) : (
        <CopyIcon aria-hidden="true" size={14} strokeWidth={2} />
      )}
    </button>
  );
}

function StorybookCodeBlockPane({
  code,
  language = "tsx",
  highlightLines,
  showLineNumbers = false,
}: {
  readonly code: string;
  readonly language?: BundledLanguage;
  readonly highlightLines?: readonly number[];
  readonly showLineNumbers?: boolean;
}) {
  const [html, setHtml] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    highlightCode(code, language).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const lines = React.useMemo(
    () => (html ? splitShikiLines(html) : []),
    [html]
  );
  const useLineView =
    (highlightLines !== undefined && highlightLines.length > 0) ||
    showLineNumbers;

  return (
    <div
      className="afenda-storybook-code-block__pane"
      data-slot="code-block-pane"
    >
      {html ? (
        useLineView ? (
          <pre className="shiki">
            <code>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const isHighlighted =
                  highlightLines?.includes(lineNumber) ?? false;

                return (
                  <div
                    className={
                      isHighlighted
                        ? "afenda-storybook-code-block__line afenda-storybook-code-block__line--highlight"
                        : "afenda-storybook-code-block__line"
                    }
                    key={lineNumber}
                  >
                    {showLineNumbers ? (
                      <span className="afenda-storybook-code-block__line-number">
                        {lineNumber}
                      </span>
                    ) : null}
                    <span
                      className="afenda-storybook-code-block__line-content"
                      // Shiki output is trusted syntax-highlight HTML
                      dangerouslySetInnerHTML={{
                        __html: line.length > 0 ? line : "&nbsp;",
                      }}
                    />
                  </div>
                );
              })}
            </code>
          </pre>
        ) : (
          <div
            className="afenda-storybook-code-block__highlight-block"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      ) : (
        <pre className="afenda-storybook-code-block__placeholder">{code}</pre>
      )}
    </div>
  );
}

/**
 * Storybook-only Shiki code block — normalized from shadcn-studio code-block-05.
 * Governed Tabs used without className; all chrome in code-block-preview.css.
 */
export function StorybookCodeBlock({
  code,
  language = "tsx",
  filename,
  files,
  highlightLines,
  showLineNumbers,
  width = "xl",
}: StorybookCodeBlockProps): ReactNode {
  const normalizedFiles: StorybookCodeBlockFile[] = React.useMemo(() => {
    if (files !== undefined && files.length > 0) return [...files];

    if (code !== undefined) {
      const file: StorybookCodeBlockFile = {
        filename: filename ? `${filename}.${language}` : `index.${language}`,
        code,
        language,
        ...(highlightLines === undefined ? {} : { highlightLines }),
        ...(showLineNumbers === undefined ? {} : { showLineNumbers }),
      };
      return [file];
    }

    return [];
  }, [files, code, language, filename, highlightLines, showLineNumbers]);

  const isMulti = normalizedFiles.length > 1;
  const [activeTab, setActiveTab] = React.useState(
    normalizedFiles[0]?.filename ?? ""
  );

  React.useEffect(() => {
    if (
      normalizedFiles.length > 0 &&
      !normalizedFiles.some((file) => file.filename === activeTab)
    ) {
      setActiveTab(normalizedFiles[0]?.filename ?? "");
    }
  }, [normalizedFiles, activeTab]);

  const activeFile =
    normalizedFiles.find((file) => file.filename === activeTab) ??
    normalizedFiles[0];

  if (normalizedFiles.length === 0) return null;

  return (
    <div
      className="afenda-storybook-code-block"
      data-slot="code-block"
      data-width={width}
    >
      <div
        className="afenda-storybook-code-block__header"
        data-slot="code-block-header"
      >
        {isMulti ? (
          <div className="afenda-storybook-code-block__tabs">
            <Tabs onValueChange={setActiveTab} value={activeTab}>
              <TabsList variant="line">
                {normalizedFiles.map((file) => (
                  <TabsTrigger key={file.filename} value={file.filename}>
                    {file.filename}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        ) : (
          <span
            className="afenda-storybook-code-block__filename"
            data-slot="code-block-filename"
          >
            {normalizedFiles[0]?.filename}
          </span>
        )}

        {activeFile ? (
          <StorybookCodeBlockCopyButton code={activeFile.code} />
        ) : null}
      </div>

      {activeFile ? (
        <StorybookCodeBlockPane
          code={activeFile.code}
          key={activeFile.filename}
          {...(activeFile.highlightLines === undefined
            ? {}
            : { highlightLines: activeFile.highlightLines })}
          {...(activeFile.language === undefined
            ? {}
            : { language: activeFile.language })}
          {...(activeFile.showLineNumbers === undefined
            ? {}
            : { showLineNumbers: activeFile.showLineNumbers })}
        />
      ) : null}
    </div>
  );
}
