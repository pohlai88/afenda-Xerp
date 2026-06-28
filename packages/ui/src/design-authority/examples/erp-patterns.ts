import type { GovernedExample } from "../contracts/example.contract";

/**
 * Governed ERP examples for AI-IDE imitation.
 *
 * Rules every example must follow:
 * 1. Import ONLY from "@afenda/ui/design-authority" (no deep imports).
 * 2. Use recipes, variants, tokens, slots, and state policy from the registry.
 * 3. Apply className for layout only — no semantic classes in className strings.
 * 4. Annotate interactive elements with governed accessibility attributes.
 * 5. Include drift warnings so AI IDEs stay within the guardrails.
 * 6. All token references must use the afenda.* prefix.
 */
export const erpGovernedExamples = [
  {
    name: "InvoiceApprovalPanel",
    imitationOnly: true,
    purpose:
      "Shows a common ERP review surface using governed recipes, variants, slots, states, and layout-only className.",
    importsFrom: "@afenda/ui/design-authority",
    demonstrates: [
      "button recipe with afenda.* tokens",
      "badge recipe with afenda.status-tone.* tokens",
      "card recipe",
      "status state",
      "layout-only className",
      "semantic labels and live region",
    ],
    source: `import {
  AFENDA_RECIPE_REGISTRY,
  statePolicy,
  validateLayoutClassName,
} from "@afenda/ui/design-authority";

const panelLayout = "grid gap-4";
const layoutResult = validateLayoutClassName(panelLayout);

if (!layoutResult.valid) {
  throw new Error("InvoiceApprovalPanel uses semantic styling in className.");
}

const cardRecipe = AFENDA_RECIPE_REGISTRY.recipes.find((recipe) => recipe.name === "card");
const statusPattern = statePolicy.states.find((pattern) => pattern.state === "ready");

export function InvoiceApprovalPanel() {
  return (
    <section aria-labelledby="invoice-approval-title" className={panelLayout}>
      <header>
        <h2 id="invoice-approval-title">Invoice approval</h2>
      </header>
      <div data-recipe={cardRecipe?.name}>
        <p data-state={statusPattern?.state} aria-live={statusPattern?.ariaLive}>
          Ready for approval
        </p>
      </div>
    </section>
  );
}`,
    driftWarnings: [
      "Do not replace data-recipe with raw bg, text, rounded, shadow, or animation classes.",
      "Do not deep-import contracts or registries from internal folders.",
      "Do not add ERP business logic to the design-system package.",
      "Token names must use the afenda.* prefix — never use unprefixed names.",
    ],
  },
  {
    name: "VendorTableView",
    imitationOnly: true,
    purpose:
      "Demonstrates the governed table recipe with density and size variants, an empty state, and aria-live for async data.",
    importsFrom: "@afenda/ui/design-authority",
    demonstrates: [
      "table recipe",
      "density variant",
      "size variant",
      "empty state with aria-live",
      "layout-only className",
    ],
    source: `import {
  AFENDA_RECIPE_REGISTRY,
  statePolicy,
  validateLayoutClassName,
} from "@afenda/ui/design-authority";

const tableLayout = "w-full overflow-x-auto";
const layoutResult = validateLayoutClassName(tableLayout);

if (!layoutResult.valid) {
  throw new Error("VendorTableView uses semantic styling in className.");
}

const tableRecipe = AFENDA_RECIPE_REGISTRY.recipes.find((recipe) => recipe.name === "table");
const emptyState = statePolicy.states.find((pattern) => pattern.state === "empty");

export function VendorTableView({ vendors }: { vendors: string[] }) {
  return (
    <div className={tableLayout}>
      <table
        aria-label="Vendor list"
        data-recipe={tableRecipe?.name}
        data-density="compact"
        data-size="sm"
      >
        <thead data-slot="header">
          <tr>
            <th scope="col">Vendor name</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody data-slot="body">
          {vendors.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                data-state={emptyState?.state}
                aria-live={emptyState?.ariaLive}
              >
                No vendors found.
              </td>
            </tr>
          ) : (
            vendors.map((vendor) => (
              <tr key={vendor}>
                <td>{vendor}</td>
                <td>Active</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}`,
    driftWarnings: [
      "Do not invent density or size values outside the governed density/size variants.",
      "Do not add raw padding, font-size, or color utilities to table cells.",
      "Empty state must use the governed state pattern and aria-live — not a custom div with inline styles.",
    ],
  },
  {
    name: "PurchaseOrderForm",
    imitationOnly: true,
    purpose:
      "Demonstrates the governed form-control recipe with label, control, and state slots, plus the invalid state for validation feedback.",
    importsFrom: "@afenda/ui/design-authority",
    demonstrates: [
      "form-control recipe",
      "label slot",
      "control slot",
      "state slot",
      "invalid state",
      "aria error message pattern",
    ],
    source: `import {
  AFENDA_RECIPE_REGISTRY,
  statePolicy,
  validateLayoutClassName,
} from "@afenda/ui/design-authority";

const formLayout = "grid gap-4";
const layoutResult = validateLayoutClassName(formLayout);

if (!layoutResult.valid) {
  throw new Error("PurchaseOrderForm uses semantic styling in className.");
}

const formRecipe = AFENDA_RECIPE_REGISTRY.recipes.find((recipe) => recipe.name === "form-control");
const invalidState = statePolicy.states.find((pattern) => pattern.state === "invalid");

export function PurchaseOrderForm({ error }: { error?: string }) {
  return (
    <form
      aria-label="Purchase order"
      data-recipe={formRecipe?.name}
      className={formLayout}
    >
      <div data-slot="root">
        <label htmlFor="po-number" data-slot="label">
          PO number
        </label>
        <input
          id="po-number"
          type="text"
          data-slot="control"
          aria-describedby={error ? "po-number-error" : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p
            id="po-number-error"
            role="alert"
            data-slot="state"
            data-state={invalidState?.state}
            aria-live={invalidState?.ariaLive}
          >
            {error}
          </p>
        )}
      </div>
    </form>
  );
}`,
    driftWarnings: [
      "Do not use raw text-red, border-red, or ring-red classes for invalid state styling.",
      "Validation messages must use the governed invalid state pattern with aria-live and role=alert.",
      "Label, control, and state slots must not carry semantic color or layout overrides via className.",
    ],
  },
  {
    name: "PermissionDeniedState",
    imitationOnly: true,
    purpose:
      "Demonstrates the governed status recipe with the forbidden tone, assertive aria-live, and a clear user-actionable message.",
    importsFrom: "@afenda/ui/design-authority",
    demonstrates: [
      "status recipe",
      "forbidden tone",
      "assertive aria-live",
      "governed state copy role",
      "layout-only className",
    ],
    source: `import {
  AFENDA_RECIPE_REGISTRY,
  statePolicy,
  validateLayoutClassName,
} from "@afenda/ui/design-authority";

const stateLayout = "flex items-center justify-center";
const layoutResult = validateLayoutClassName(stateLayout);

if (!layoutResult.valid) {
  throw new Error("PermissionDeniedState uses semantic styling in className.");
}

const statusRecipe = AFENDA_RECIPE_REGISTRY.recipes.find(
  (recipe) => recipe.name === "status",
);
const forbiddenState = statePolicy.states.find(
  (pattern) => pattern.state === "forbidden",
);

export function PermissionDeniedState() {
  return (
    <div
      role="status"
      className={stateLayout}
      data-recipe={statusRecipe?.name}
      data-tone={forbiddenState?.tone}
      data-state={forbiddenState?.state}
      aria-live={forbiddenState?.ariaLive}
    >
      <div data-slot="root">
        <div data-slot="content">
          <p>You do not have permission to view this resource.</p>
          <p>Contact your administrator to request access.</p>
        </div>
      </div>
    </div>
  );
}`,
    driftWarnings: [
      "Do not apply raw purple, indigo, or violet color classes for the forbidden tone.",
      "Do not omit aria-live — forbidden states are announced assertively to screen readers.",
      "Do not invent a new status pattern — use the governed forbidden state from statePolicy.",
    ],
  },
] as const satisfies readonly GovernedExample[];
