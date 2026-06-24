import React from "react";

type Loader<P> = () => Promise<
  React.ComponentType<P> | { default: React.ComponentType<P> }
>;

interface DynamicOptions<P> {
  loading?: React.ComponentType;
  ssr?: boolean;
  suspense?: boolean;
  loader?: Loader<P>;
}

/**
 * Storybook / Vitest stand-in for `next/dynamic`.
 *
 * Wraps the loader with React.lazy + Suspense so dynamic imports work
 * transparently in Vite without Next.js runtime.  The `ssr` and `suspense`
 * options are silently ignored (irrelevant in a browser-only Storybook env).
 */
export default function dynamic<P extends Record<string, unknown>>(
  loaderOrOptions: Loader<P> | DynamicOptions<P>,
  options?: DynamicOptions<P>
): React.ComponentType<P> {
  const loader: Loader<P> =
    typeof loaderOrOptions === "function"
      ? loaderOrOptions
      : (loaderOrOptions.loader ?? (() => Promise.resolve({ default: () => null as unknown as React.ReactElement })));

  const opts: DynamicOptions<P> =
    typeof loaderOrOptions === "function" ? (options ?? {}) : loaderOrOptions;

  const LazyComponent = React.lazy(async () => {
    const mod = await loader();
    if ("default" in mod && mod.default) {
      return { default: mod.default };
    }
    return { default: mod as React.ComponentType<P> };
  });

  function DynamicMock(props: P) {
    const Loading = opts.loading;
    return (
      <React.Suspense fallback={Loading ? <Loading /> : null}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  }

  DynamicMock.displayName = "DynamicMock";
  return DynamicMock as React.ComponentType<P>;
}
