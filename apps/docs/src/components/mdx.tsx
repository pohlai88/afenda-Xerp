import { AutoTypeTable } from "@/components/auto-type-table";
import { GraphView } from "@/components/graph-view";
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

/**
 * Global MDX component registry — full Fumadocs UI catalog.
 *
 * Matches https://fumadocs.dev/docs/ui/components:
 * Accordion, Auto Type Table, Banner, Code Block, Code Block (Dynamic), Files,
 * GitHub Info, Graph View, Zoomable Image, Inline TOC, Steps, Tabs, Type Table.
 *
 * Graph View: pass `graph={buildGraph()}` from `@/lib/build-graph`, or use
 * `SiteGraphView` from `@/components/site-graph-view` in layouts.
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
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
    DynamicCodeBlock,
    File,
    Files,
    Folder,
    GithubInfo,
    GraphView,
    ImageZoom,
    InlineTOC,
    Pre,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
