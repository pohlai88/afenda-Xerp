/**
 * react-erp-policy — Gate F static checker
 *
 * Covers five react-erp-quality rules detectable via static source analysis:
 *
 *   R1  Static recharts import         — import from "recharts" must use next/dynamic
 *   R2  React.forwardRef               — removed in React 19; use ref as plain prop
 *   R3  useEffect derived-state sync   — useEffect with ONLY a set* call (re-render loop)
 *   R4  Chart a11y                     — recharts chart element without aria-hidden
 *   R5  Raw <img>                      — use next/image instead of <img
 *   R6  Module-level mutable state     — let/var at top scope in non-"use client" files
 *
 * Applies to:
 *   packages/appshell/src/**\/*.{tsx,ts}   (except __tests__)
 *   apps/erp/src/**\/*.{tsx,ts}            (except __tests__)
 *   packages/metadata-ui/src/**\/*.{tsx}   (except __tests__)
 */

/** Recharts chart elements that need aria-hidden (or figure wrapper). */
const RECHARTS_CHART_COMPONENTS = [
  "AreaChart",
  "BarChart",
  "LineChart",
  "PieChart",
  "RadarChart",
  "RadialBarChart",
  "ScatterChart",
  "ComposedChart",
  "FunnelChart",
  "Treemap",
];

const RECHARTS_IMPORT_RE = /\bfrom\s+["']recharts["']/;

const FORWAWRD_REF_RE = /\bforwardRef\s*[(<]/;

/**
 * A useEffect whose callback body is a single statement that is a set* call,
 * i.e. `useEffect(() => { setSomething(…); }, […]);`.
 *
 * Pattern:
 *   useEffect(\s*\(\s*\)\s*=>\s*\{
 *     <whitespace>
 *     set<Identifier>(...);
 *     <whitespace>
 *   \},
 */
const USE_EFFECT_DERIVED_STATE_RE =
  /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{\s*\n\s*(set[A-Z]\w*)\s*\([^)]*\)\s*;\s*\n\s*\}\s*,/;

const RAW_IMG_RE = /<img\s/;

/**
 * Top-level mutable `let` or `var` declaration — module-scoped mutable state.
 * Only matches at the start of a line to avoid inside function bodies (imperfect
 * but catches the most common pattern).
 */
const MODULE_LEVEL_MUTABLE_RE = /^(?:let|var)\s+[a-zA-Z_$]/m;

const USE_CLIENT_DIRECTIVE_RE = /^["']use client["']/m;
const USE_SERVER_DIRECTIVE_RE = /^["']use server["']/m;

// ─── Rule helpers ─────────────────────────────────────────────────────────────

/**
 * @param {string} content
 * @returns {string[]}
 */
export function checkStaticRechartsImport(content) {
  if (!RECHARTS_IMPORT_RE.test(content)) {
    return [];
  }

  return [
    'Static import from "recharts" — use next/dynamic with ssr:false so recharts (~200 KB) stays out of the initial bundle. ' +
      'See .cursor/skills/react-erp-quality/SKILL.md Gate 5.1.',
  ];
}

/**
 * @param {string} content
 * @returns {string[]}
 */
export function checkForwardRef(content) {
  if (!FORWAWRD_REF_RE.test(content)) {
    return [];
  }

  return [
    'forwardRef() detected — React 19 passes ref as a plain prop; remove forwardRef() wrapper. ' +
      'See .cursor/skills/react-erp-quality/SKILL.md Gate 4.4.',
  ];
}

/**
 * Detect the specific anti-pattern:
 *   const [x, setX] = useState(y);
 *   useEffect(() => { setX(y); }, [y]);
 *
 * The heuristic: a useEffect whose arrow body contains ONLY a single set* call.
 * @param {string} content
 * @returns {string[]}
 */
export function checkUseEffectDerivedState(content) {
  const match = USE_EFFECT_DERIVED_STATE_RE.exec(content);
  if (!match) {
    return [];
  }

  const setter = match[1];
  return [
    `useEffect with single ${setter}() call detected — this syncs derived state from a prop. ` +
      `Derive during render or use key-prop reset instead. ` +
      `See .cursor/skills/react-erp-quality/SKILL.md Gate 2.1.`,
  ];
}

/**
 * Recharts chart elements must have aria-hidden="true" on the chart component
 * so screenreaders skip the SVG internals (the parent figure/div provides the label).
 * @param {string} content
 * @returns {string[]}
 */
export function checkChartA11y(content) {
  if (!RECHARTS_IMPORT_RE.test(content)) {
    return [];
  }

  const violations = [];

  for (const chartEl of RECHARTS_CHART_COMPONENTS) {
    const tagRe = new RegExp(`<${chartEl}(?=[\\s/>])`, "g");
    const ariaHiddenRe = new RegExp(
      `<${chartEl}[^>]*aria-hidden(?:=(?:["']true["']|\\{true\\}))?[^>]*>`,
      "g"
    );

    const allTags = [...content.matchAll(tagRe)];
    const hiddenTags = [...content.matchAll(ariaHiddenRe)];

    if (allTags.length > hiddenTags.length) {
      const missing = allTags.length - hiddenTags.length;
      violations.push(
        `${chartEl} used ${missing}x without aria-hidden="true" — wrap in ` +
          `<figure aria-label="…"> and add aria-hidden="true" to the chart element. ` +
          `See .cursor/skills/react-erp-quality/SKILL.md Gate 1.2.`
      );
    }
  }

  return violations;
}

/**
 * Raw <img> elements should be replaced with next/image.
 * @param {string} content
 * @param {string} [filePath]
 * @returns {string[]}
 */
export function checkRawImg(content, filePath = "") {
  if (!RAW_IMG_RE.test(content)) {
    return [];
  }

  // Ignore Storybook stories — they use raw img for demo fixtures
  if (filePath.includes(".stories.")) {
    return [];
  }

  return [
    '<img> element detected — use Next.js <Image> from "next/image" for automatic optimization. ' +
      'See .cursor/skills/react-erp-quality/SKILL.md Gate 5.5.',
  ];
}

/**
 * Detect module-level mutable state (let/var) in files that are NOT "use client".
 * Server components / utilities sharing mutable module state across requests is
 * a critical bug — each request shares the module instance.
 * @param {string} content
 * @param {string} [filePath]
 * @returns {string[]}
 */
export function checkModuleMutableState(content, filePath = "") {
  // Only applies to server-side files (no "use client" directive)
  if (USE_CLIENT_DIRECTIVE_RE.test(content)) {
    return [];
  }

  // Route handlers with "use server" are fine to have mutable module let (e.g. cached handler)
  if (USE_SERVER_DIRECTIVE_RE.test(content)) {
    return [];
  }

  // Only check .ts / .tsx files that are not tests or stories
  if (
    filePath.includes(".test.") ||
    filePath.includes(".spec.") ||
    filePath.includes(".stories.")
  ) {
    return [];
  }

  if (!MODULE_LEVEL_MUTABLE_RE.test(content)) {
    return [];
  }

  return [
    "Module-level mutable let/var in a Server Component or shared module — " +
      "this state is shared across all requests. Use React.cache() or per-request context. " +
      "See .cursor/skills/react-erp-quality/SKILL.md Gate 3.2.",
  ];
}

// ─── Aggregate check ──────────────────────────────────────────────────────────

/**
 * @param {string} content
 * @param {string} [filePath]
 * @returns {string[]}
 */
export function checkReactErpQuality(content, filePath = "") {
  return [
    ...checkStaticRechartsImport(content),
    ...checkForwardRef(content),
    ...checkUseEffectDerivedState(content),
    ...checkChartA11y(content),
    ...checkRawImg(content, filePath),
    ...checkModuleMutableState(content, filePath),
  ];
}

/** Paths where React ERP quality policy applies. */
export const REACT_ERP_QUALITY_PATH =
  /(?:^|[/\\])(?:packages[/\\]appshell[/\\]src|packages[/\\]metadata-ui[/\\]src|apps[/\\]erp[/\\]src)[/\\].*\.[jt]sx?$/i;
