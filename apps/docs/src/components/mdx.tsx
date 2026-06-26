import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Banner } from "fumadocs-ui/components/banner";
import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import {
  CodeBlock,
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  Pre,
} from "fumadocs-ui/components/codeblock";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { OpenAPIPage } from "@/components/api-page.client";
import { AutoTypeTable } from "@/components/auto-type-table";
import {
  DocsAccordionPanel,
  DocsAnnouncementBar,
  DocsCallout,
  DocsCodePanel,
  DocsFeatureStrip,
  DocsFileTree,
  DocsGuideCardGrid,
  DocsInlineToc,
  DocsPropTable,
  DocsStepsPanel,
  DocsTabbedPanel,
} from "@/components/blocks";
import { DocsSiteGraph } from "@/components/docs-site-graph";
import { GeneratedReference } from "@/components/generated-reference";
import { GraphView } from "@/components/graph-view";

/**
 * Global MDX component registry — full Fumadocs UI catalog.
 *
 * Matches https://fumadocs.dev/docs/ui/components:
 * Accordion, Auto Type Table, Banner, Code Block, Code Block (Dynamic), Files,
 * GitHub Info, Graph View, Zoomable Image, Inline TOC, Steps, Tabs, Type Table.
 *
 * TypeScript docgen: remark `<auto-type-table />` (build) + `AutoTypeTable` (RSC).
 * Both require `TypeTable` for remark output; see docs-type-generator.ts.
 *
 * Graph View: pass `graph={buildGraph()}` from `@/lib/build-graph`.
 *
 * Afenda editorial blocks (Slice 5.1): copied from packages/ui reference catalog —
 * zero @afenda/ui runtime imports; styled via docs-editorial-blocks.css.
 *
 * Slice C: all markdown images use ImageZoom via the `img` slot.
 */
function MdxImage(props: ComponentProps<"img">) {
  const { src, alt, className } = props;
  if (!src || typeof src !== "string") {
    return null;
  }

  return (
    <ImageZoom
      alt={alt ?? ""}
      src={src}
      {...(className ? { className } : {})}
    />
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    OpenAPIPage,
    APIPage: OpenAPIPage,
    AutoTypeTable,
    Banner,
    Callout,
    Card,
    Cards,
    CodeBlock,
    CodeBlockTab,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    DocsAccordionPanel,
    DocsAnnouncementBar,
    DocsCallout,
    DocsCodePanel,
    DocsFeatureStrip,
    DocsFileTree,
    DocsGuideCardGrid,
    DocsInlineToc,
    DocsPropTable,
    DocsStepsPanel,
    DocsTabbedPanel,
    DocsSiteGraph,
    GeneratedReference,
    DynamicCodeBlock,
    File,
    Files,
    Folder,
    GithubInfo,
    GraphView,
    ImageZoom,
    InlineTOC,
    img: MdxImage as NonNullable<MDXComponents["img"]>,
    Pre,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  } as MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
