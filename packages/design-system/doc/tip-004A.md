You are implementing **TIP-004A — Design System Authority Completion** for Afenda.

Objective:
Complete `@afenda/design-system` as the full governance-only design authority before any downstream `@afenda/ui` adoption.

This package must become the single source of truth for:

* design authority identity
* token vocabulary
* token registry
* token naming policy
* CSS variable naming policy
* status tones
* sizes
* densities
* radius
* shadow
* typography
* motion
* variant axes
* variant options
* recipe declarations
* slot roles
* governed UI states
* accessibility requirements
* className policy
* export surface
* AI imitation examples
* governance checker
* tests
* delivery documentation

Architecture rule:
`@afenda/design-system` is governance-only.

It must contain:

* TypeScript contracts
* typed registries
* policy declarations
* validation helpers
* governance checker scripts
* tests
* documentation

It must not contain:

* React components
* Radix components
* shadcn components
* Storybook stories
* CSS files
* Tailwind config ownership
* runtime UI behavior
* app pages
* business logic
* database logic
* metadata rendering logic

Package boundary:

`@afenda/design-system` owns authority.
`@afenda/ui` owns React implementation.
`@afenda/metadata-ui` owns metadata rendering.
`@afenda/appshell` owns shell composition.
Apps own application surfaces only.

Do not modify:

* `packages/ui`
* `packages/metadata-ui`
* `packages/appshell`
* `apps/erp`
* database/auth/permissions packages
* accounting/domain packages
* unrelated workspace configs unless required for package script wiring

Allowed scope:

* `packages/design-system`
* `docs/delivery/tip-004a-design-system-authority.md`
* workspace package references only if required for scripts

---

## 1. Token Prefix Policy

Implement Afenda-prefixed token authority.

All governed token names must use the canonical prefix:

```ts
afenda.<category>.<domain>.<name>
```

Examples:

```ts
afenda.color.surface.canvas
afenda.color.surface.card
afenda.color.text.default
afenda.color.text.muted
afenda.color.border.default
afenda.status-tone.success.surface
afenda.status-tone.success.foreground
afenda.status-tone.danger.border
afenda.spacing.1
afenda.radius.md
afenda.shadow.raised
afenda.typography.body.sm
afenda.motion.duration.fast
afenda.motion.easing.standard
afenda.density.standard
```

All CSS variables must use:

```css
--afenda-<category>-<domain>-<name>
```

Examples:

```css
--afenda-color-surface-canvas
--afenda-color-surface-card
--afenda-color-text-default
--afenda-status-tone-success-surface
--afenda-radius-md
--afenda-shadow-raised
--afenda-motion-duration-fast
```

Rules:

* Token name is the design-system contract name.
* CSS variable is the runtime implementation target.
* Token names must never be raw Tailwind classes.
* Token names must never be unprefixed.
* CSS variables must never be unprefixed.
* Raw values may exist only inside the token registry.
* Downstream packages must consume token names or CSS variable references, never invent values.

Required types:

```ts
export type AfendaTokenName = `afenda.${AfendaTokenCategory}.${string}`;
export type AfendaCssVariableName = `--afenda-${string}`;
```

Add helpers:

```ts
isAfendaTokenName(value: string): value is AfendaTokenName
assertAfendaTokenName(value: string): asserts value is AfendaTokenName
tokenNameToCssVariable(tokenName: AfendaTokenName): AfendaCssVariableName
```

The helper must convert:

```ts
afenda.color.surface.canvas
```

to:

```ts
--afenda-color-surface-canvas
```

---

## 2. Required Design-System Directory Structure

Create or normalize:

```txt
packages/design-system/src/
  accessibility.contract.ts
  class-name-policy.contract.ts
  component.contract.ts
  design-system-authority.contract.ts
  design-system.contract.ts
  example.contract.ts
  export.contract.ts
  motion.contract.ts
  recipe.contract.ts
  slot.contract.ts
  state.contract.ts
  token.contract.ts
  variant.contract.ts

  registries/
    token.registry.ts
    variant.registry.ts
    recipe.registry.ts
    state.registry.ts
    motion.registry.ts
    accessibility.registry.ts
    example.registry.ts

  policies/
    accessibility.ts
    ai-generation-policy.ts
    class-name-policy.ts
    css-variable-policy.ts
    drift-validation.ts
    export-surface.ts
    motion.ts
    state.ts
    token-name-policy.ts

  validation/
    token.validation.ts
    variant.validation.ts
    recipe.validation.ts
    state.validation.ts
    motion.validation.ts
    class-name.validation.ts
    export.validation.ts

  examples/
    button.example.ts
    badge.example.ts
    card.example.ts
    surface.example.ts

  scripts/
    check-governance.ts
    check-public-api.ts
    check-token-prefix.ts
    check-no-runtime-ui.ts
    check-no-deep-imports.ts
    check-no-duplicate-authority.ts

  __tests__/
    token.contract.test.ts
    token-prefix.test.ts
    css-variable.test.ts
    variant.contract.test.ts
    recipe.contract.test.ts
    state.contract.test.ts
    motion.contract.test.ts
    accessibility.contract.test.ts
    class-name-policy.test.ts
    export-surface.test.ts
    no-runtime-ui.test.ts
    governance-checker.test.ts

  index.ts
```

Use kebab-case file names only.
Do not create mixed naming styles.
Do not add barrel files except the root `index.ts`.

---

## 3. Token Contract Requirements

Update `token.contract.ts` to own:

* token categories
* token name format
* CSS variable format
* status tones
* sizes
* densities
* radii
* shadows
* typography scale names
* motion token names
* token registry type
* token definition type

Required categories:

```ts
color
status-tone
spacing
radius
shadow
typography
motion
density
opacity
z-index
breakpoint
layout
```

Required status tones:

```ts
neutral
info
success
warning
danger
forbidden
invalid
```

Required densities:

```ts
compact
standard
comfortable
```

Required sizes:

```ts
xs
sm
md
lg
```

Required radii:

```ts
none
sm
md
lg
full
```

Required shadows:

```ts
none
raised
overlay
focus
```

Rules:

* `TokenName` must be renamed or aliased to `AfendaTokenName`.
* Every token name must begin with `afenda.`
* Every token definition must include:

  * name
  * cssVariable
  * category
  * description
  * value
  * stable
  * public
* Raw values may exist only in `token.registry.ts`.
* Contracts may define types and policy only.
* Registries may define approved token records.

---

## 4. Token Registry Requirements

Create `registries/token.registry.ts`.

It must export:

```ts
AFENDA_TOKEN_REGISTRY
AFENDA_TOKEN_NAMES
AFENDA_CSS_VARIABLES
```

Every token must satisfy:

```ts
readonly name: AfendaTokenName;
readonly cssVariable: AfendaCssVariableName;
readonly category: AfendaTokenCategory;
readonly value: string;
readonly stable: boolean;
readonly public: boolean;
readonly description: string;
```

Minimum required tokens:

### Color surface

```ts
afenda.color.surface.canvas
afenda.color.surface.card
afenda.color.surface.muted
afenda.color.surface.inverse
```

### Color text

```ts
afenda.color.text.default
afenda.color.text.muted
afenda.color.text.inverse
afenda.color.text.disabled
```

### Color border

```ts
afenda.color.border.default
afenda.color.border.muted
afenda.color.border.strong
afenda.color.border.focus
```

### Status tone tokens

For every status tone:

```ts
afenda.status-tone.<tone>.surface
afenda.status-tone.<tone>.foreground
afenda.status-tone.<tone>.border
afenda.status-tone.<tone>.focus
```

### Radius

```ts
afenda.radius.none
afenda.radius.sm
afenda.radius.md
afenda.radius.lg
afenda.radius.full
```

### Shadow

```ts
afenda.shadow.none
afenda.shadow.raised
afenda.shadow.overlay
afenda.shadow.focus
```

### Typography

```ts
afenda.typography.body.xs
afenda.typography.body.sm
afenda.typography.body.md
afenda.typography.label.sm
afenda.typography.label.md
afenda.typography.heading.sm
afenda.typography.heading.md
```

### Motion

```ts
afenda.motion.duration.instant
afenda.motion.duration.fast
afenda.motion.duration.normal
afenda.motion.duration.slow
afenda.motion.easing.standard
afenda.motion.easing.emphasized
```

### Density

```ts
afenda.density.compact
afenda.density.standard
afenda.density.comfortable
```

---

## 5. Variant Contract Requirements

Update `variant.contract.ts`.

Variant owns visual meaning only.

Required axes:

```ts
intent
tone
density
size
radius
shadow
emphasis
```

Required intent options:

```ts
primary
secondary
quiet
destructive
```

Required emphasis options:

```ts
solid
soft
outline
ghost
```

Rules:

* Variants must reference token categories only.
* Variants must not contain raw CSS values.
* Variants must not contain Tailwind classes.
* Variants must not define behavior.
* Variants must not define slot structure.
* Variants must not define business state.

Create `registries/variant.registry.ts`.

It must export:

```ts
AFENDA_VARIANT_REGISTRY
AFENDA_VARIANT_AXES
AFENDA_VARIANT_OPTIONS
```

Every variant option must be traceable to:

* axis
* option
* meaning
* allowed token categories

---

## 6. Recipe Contract Requirements

Update `recipe.contract.ts`.

Recipe owns styling composition declarations, not implementation classes.

Recipe declarations must use token names, variant axes, and slots.

Recipe declarations must not contain:

* Tailwind classes
* CSS files
* React components
* Radix imports
* raw hex colors
* raw px values
* arbitrary values
* business logic

Create `registries/recipe.registry.ts`.

Required governed recipes:

```ts
button
badge
card
surface
status
form-control
table
```

Minimum recipe declarations:

### Button recipe

Axes:

```ts
intent
emphasis
size
density
```

Slots:

```ts
root
icon
label
state
```

Declarations must include:

* background token
* foreground token
* border token
* radius token
* typography token
* height/spacing token
* focus ring token
* motion token

### Badge recipe

Axes:

```ts
tone
emphasis
size
density
```

Slots:

```ts
root
icon
label
```

Declarations must include:

* status tone surface token
* status tone foreground token
* status tone border token
* radius token
* typography token

### Card recipe

Axes:

```ts
radius
shadow
density
```

Slots:

```ts
root
header
body
footer
actions
```

Declarations must include:

* surface token
* foreground token
* border token
* radius token
* shadow token
* spacing token

The recipe registry must provide only declarations such as:

```ts
{
  name: "button",
  componentKind: "button",
  variantAxes: ["intent", "emphasis", "size", "density"],
  slots: [...],
  declarations: [...]
}
```

No runtime class output belongs in `@afenda/design-system`.

---

## 7. Slot Contract Requirements

Slot owns structure only.

Required slot roles:

```ts
root
header
body
footer
label
control
icon
content
actions
state
```

Rules:

* Slots must not define styling.
* Slots must not define behavior.
* Slots must not define business logic.
* Required slots must be explicit in recipe and component contracts.

---

## 8. State Contract Requirements

State owns UI state meaning only.

Required governed states:

```ts
loading
empty
error
forbidden
invalid
ready
```

Create `registries/state.registry.ts`.

Every state pattern must include:

```ts
state
tone
ariaLive
requiredCopyRole
```

Rules:

* State names must not represent domain workflow status.
* Forbidden examples:

  * approved
  * rejected
  * paid
  * submitted
  * archived
  * pending
  * completed
* Domain states must map to governed UI states before reaching UI components.

---

## 9. Motion Contract Requirements

Motion owns movement safety.

Required motion intents:

```ts
instant
feedback
navigation
overlay
```

Create `registries/motion.registry.ts`.

Every motion pattern must include:

```ts
intent
durationToken
easingToken
reducedMotionBehavior
```

Rules:

* Duration tokens must use `afenda.motion.duration.*`.
* Easing tokens must use `afenda.motion.easing.*`.
* No raw duration values.
* No raw easing strings.
* No animation class names.
* Motion must not communicate state without accessible alternative.

---

## 10. Accessibility Contract Requirements

Accessibility owns interaction safety.

Required baseline requirements:

```ts
semanticElement
keyboardReachable
visibleFocus
programmaticName
stateAnnounced
colorNotOnlySignal
reducedMotionSafe
```

Create `registries/accessibility.registry.ts`.

Must include:

```ts
baseline
focusRingToken
minTouchTargetToken
statusMustUseAriaLive
```

Do not use raw `"44px"` if possible.
Use token:

```ts
afenda.layout.touch-target.minimum
```

If the token does not exist, add it to the token registry.

Rules:

* Accessibility must not own permission logic.
* Accessibility must not own business logic.
* Accessibility must not create visual tokens.
* Accessibility must reference governed tokens.

---

## 11. ClassName Policy Requirements

Update `class-name-policy.contract.ts`.

ClassName owns layout escape only.

Required prohibited patterns:

```ts
bg-
text-
border-
shadow
rounded
ring-
animate-
duration-
ease-
opacity-
font-
leading-
tracking-
```

Required allowed layout patterns:

```ts
grid
flex
block
inline
hidden
contents
col-
row-
items-
justify-
self-
place-
order-
w-
h-
min-
max-
overflow-
```

Rules:

* className may be used only for layout.
* className must not set semantic styling.
* className must not override token, variant, recipe, state, motion, or accessibility meaning.
* Arbitrary values are prohibited unless explicitly allowlisted by design-system policy.
* The policy must export validation helpers:

  * `validateLayoutClassName`
  * `assertLayoutClassName`
  * `isLayoutClassName`

Validation must reject:

```txt
bg-blue-600
text-green-700
border-red-500
rounded-[13px]
shadow-[...]
text-[15px]
duration-300
ease-out
opacity-50
```

Validation may allow:

```txt
flex
grid
w-full
h-full
items-center
justify-between
overflow-hidden
```

---

## 12. Component Contract Requirements

Component contract owns behavior boundaries only.

It must define:

```ts
GovernedComponentContract
```

Required fields:

```ts
name
packageBoundary
recipe
slots
supportedStates
accessibility
classNamePolicy
forbidsBusinessLogic
```

Rules:

* Components consume design-system contracts.
* Components do not create design-system authority.
* Components do not define tokens.
* Components do not define variants.
* Components do not define recipes.
* Components do not define business workflows.
* React implementation belongs in `@afenda/ui`, not design-system.

Required governed component contracts:

```ts
Button
Badge
Card
Surface
Status
FormControl
Table
```

---

## 13. Export Contract Requirements

Update `export.contract.ts`.

Export policy must state:

* public access only through `@afenda/design-system`
* deep imports prohibited
* root `index.ts` is the only public export surface
* internal folders are not public
* every stable public symbol must be listed in export contract

The root `index.ts` must export:

* all public contracts
* all public types
* all registries
* all validation helpers
* all policy helpers

The root `index.ts` must not export:

* test helpers
* script internals
* private implementation details
* experimental symbols unless clearly marked

---

## 14. Example Contract Requirements

Examples are AI imitation only.

Create examples for:

```txt
button
badge
card
surface
status
```

Each example must include:

```ts
name
source
purpose
importsFrom
demonstrates
driftWarnings
imitationOnly: true
```

Rules:

* Examples must not create API authority.
* Examples must not invent tokens.
* Examples must not invent variants.
* Examples must not invent recipes.
* Examples must import only from `@afenda/design-system`.
* Examples are for AI IDE imitation only.

---

## 15. Governance Checker Requirements

Create:

```txt
packages/design-system/src/scripts/check-governance.ts
```

It must run all sub-checks:

```txt
check-public-api
check-token-prefix
check-no-runtime-ui
check-no-deep-imports
check-no-duplicate-authority
```

Checker must fail if:

* any token name does not start with `afenda.`
* any CSS variable does not start with `--afenda-`
* any raw design value appears outside token registry
* any recipe contains Tailwind classes
* any recipe contains raw CSS values
* any variant contains Tailwind classes
* any variant contains raw CSS values
* any file imports React
* any file imports Radix
* any file imports shadcn/ui
* any CSS file exists in design-system
* any Storybook file exists in design-system
* any component `.tsx` file exists in design-system
* any deep import path is used in examples
* any public symbol is missing from `index.ts`
* any local duplicate authority registry exists outside the approved registries
* any unprefixed token name exists
* any unprefixed CSS variable exists

---

## 16. Package Scripts

Update `packages/design-system/package.json`.

Required scripts:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "build": "tsc -p tsconfig.json",
  "check:public-api": "tsx src/scripts/check-public-api.ts",
  "check:token-prefix": "tsx src/scripts/check-token-prefix.ts",
  "check:no-runtime-ui": "tsx src/scripts/check-no-runtime-ui.ts",
  "check:no-deep-imports": "tsx src/scripts/check-no-deep-imports.ts",
  "check:no-duplicate-authority": "tsx src/scripts/check-no-duplicate-authority.ts",
  "check:governance": "tsx src/scripts/check-governance.ts"
}
```

---

## 17. Required Tests

Add full test coverage.

Tests must prove:

* all token names are prefixed with `afenda.`
* all CSS variables are prefixed with `--afenda-`
* token names convert to CSS variables correctly
* status tone tokens exist for every status tone
* variants use only governed axes
* variants use only governed options
* recipes reference only governed tokens
* recipes reference only governed variant axes
* recipes reference only governed slots
* recipes do not contain Tailwind classes
* states use only governed state names
* states map to governed status tones
* motion uses governed motion intents
* motion uses governed motion tokens
* accessibility references governed tokens
* className policy rejects semantic styling
* className policy allows layout-only utilities
* examples are imitation-only
* examples import only from `@afenda/design-system`
* public export surface includes all stable symbols
* design-system does not import React, Radix, shadcn, UI, AppShell, Metadata UI, apps, database, auth, permissions, or accounting packages

---

## 18. Documentation

Create:

```txt
docs/delivery/tip-004a-design-system-authority.md
```

Document:

* purpose
* package boundary
* dependency direction
* governance-only rule
* Afenda token prefix policy
* CSS variable prefix policy
* token ownership
* variant ownership
* recipe ownership
* slot ownership
* state ownership
* motion ownership
* accessibility ownership
* className ownership
* component boundary
* export surface
* AI imitation examples
* prohibited drift examples
* checker coverage
* tests added
* files created
* files modified
* acceptance commands
* known gaps

---

## 19. Definition of Done

TIP-004A is complete only when:

* `@afenda/design-system` is governance-only.
* No React code exists in `@afenda/design-system`.
* No CSS files exist in `@afenda/design-system`.
* No Storybook files exist in `@afenda/design-system`.
* No runtime UI components exist in `@afenda/design-system`.
* All token names use the `afenda.` prefix.
* All CSS variables use the `--afenda-` prefix.
* Raw design values exist only in the token registry.
* Variants contain meaning only.
* Recipes contain declarations only.
* Recipes contain no Tailwind classes.
* States contain UI state meaning only.
* Motion contains movement safety only.
* Accessibility contains interaction safety only.
* className policy allows layout-only escape only.
* Examples are imitation-only.
* Root public export is complete.
* Governance checker fails on drift.
* Tests prove all authority boundaries.
* Documentation is complete.

---

## 20. Acceptance Commands

Run:

```bash
pnpm --filter @afenda/design-system typecheck
pnpm --filter @afenda/design-system test
pnpm --filter @afenda/design-system build
pnpm --filter @afenda/design-system check:public-api
pnpm --filter @afenda/design-system check:token-prefix
pnpm --filter @afenda/design-system check:no-runtime-ui
pnpm --filter @afenda/design-system check:no-deep-imports
pnpm --filter @afenda/design-system check:no-duplicate-authority
pnpm --filter @afenda/design-system check:governance
```

Then run workspace quality:

```bash
pnpm typecheck
pnpm test:run
pnpm build
pnpm quality
```

---

## 21. Prohibited

Do not:

* add React components to `@afenda/design-system`
* add `.tsx` component implementation files
* add CSS files
* add Storybook stories
* import React
* import Radix
* import shadcn
* import `@afenda/ui`
* import `@afenda/metadata-ui`
* import `@afenda/appshell`
* import app packages
* import database/auth/permissions/accounting packages
* create unprefixed token names
* create unprefixed CSS variables
* use raw design values outside token registry
* put Tailwind classes in recipe declarations
* put Tailwind classes in variant declarations
* define runtime UI behavior
* define business logic
* define permission logic
* define metadata rendering logic
* expose private files through deep imports
* create local duplicate authority outside approved registries
* weaken governance checks to make tests pass

---

## 22. Expected Final Response

Return a completion report with:

* files created
* files modified
* token prefix policy implemented
* CSS variable policy implemented
* contracts completed
* registries completed
* validation helpers added
* governance scripts added
* tests added
* docs added
* commands run
* remaining known gaps, if any
