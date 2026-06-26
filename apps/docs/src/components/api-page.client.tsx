"use client";

import type { OpenAPIPageProps_Preloaded } from "fumadocs-openapi/server";
import {
  createOpenAPIPage,
  type OpenAPIPageProps,
  type OpenAPIPageProps_Spec,
} from "fumadocs-openapi/ui";
import {
  createContext,
  type ReactNode,
  useContext,
} from "react";

export type DocsOpenAPIPageProps = OpenAPIPageProps;
export type DocsOpenAPIPreloaded = OpenAPIPageProps_Preloaded["preloaded"];

const openApiPreloadContext = createContext<DocsOpenAPIPreloaded | undefined>(
  undefined
);

export const OpenAPIPage = createOpenAPIPage();

export function OpenAPIPreloadProvider({
  children,
  preloaded,
}: {
  readonly children: ReactNode;
  readonly preloaded: DocsOpenAPIPreloaded;
}) {
  return (
    <openApiPreloadContext.Provider value={preloaded}>
      {children}
    </openApiPreloadContext.Provider>
  );
}

function useOpenApiPreload(): DocsOpenAPIPreloaded {
  const preloaded = useContext(openApiPreloadContext);
  if (preloaded === undefined) {
    throw new Error(
      "[Afenda Docs] OpenAPI preload missing — wrap MDX with OpenAPIPreloadProvider on _openapi pages."
    );
  }
  return preloaded;
}

/** MDX slot — reads preload from context so SSG does not pass function props. */
export function OpenAPIPageWithPreload(props: OpenAPIPageProps_Spec) {
  const preloaded = useOpenApiPreload();
  return <OpenAPIPage {...props} preloaded={preloaded} />;
}

/** @deprecated Use OpenAPIPageWithPreload — kept for generated MDX backward compatibility. */
export const APIPage = OpenAPIPageWithPreload;
