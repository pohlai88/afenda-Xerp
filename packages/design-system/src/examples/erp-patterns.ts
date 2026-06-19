import type { GovernedExample } from "../contracts/example.contract";

export const erpGovernedExamples = [
  {
    name: "InvoiceApprovalPanel",
    purpose:
      "Shows a common ERP review surface using governed recipes, variants, slots, states, and layout-only className.",
    importsFrom: "@afenda/design-system",
    demonstrates: [
      "button recipe",
      "badge recipe",
      "card recipe",
      "status state",
      "layout-only className",
      "semantic labels and live region",
    ],
    source: `import {
  recipeRegistry,
  statePolicy,
  validateLayoutClassName,
} from "@afenda/design-system";

const panelLayout = "grid gap-4";
const layoutResult = validateLayoutClassName(panelLayout);

if (!layoutResult.valid) {
  throw new Error("InvoiceApprovalPanel uses semantic styling in className.");
}

const cardRecipe = recipeRegistry.recipes.find((recipe) => recipe.name === "card");
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
    ],
  },
] as const satisfies readonly GovernedExample[];
