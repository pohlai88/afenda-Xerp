import type { EditorialLabPresetId } from "../../styles/presentation-lab-presets.registry.js";
import { AuthAccessFormFields } from "../auth-access-form-fields.js";
import { AuthNoirShell } from "../auth-noir-shell.js";
import { labNoirPanelLabelClassName } from "../presentation-lab/presentation-lab.noir.contract.js";

export type P1NoirEditorialProps = {
  readonly editorialPresetId?: EditorialLabPresetId;
  readonly panelLead?: string;
  readonly panelTitle?: string;
};

export function P1NoirEditorial({
  editorialPresetId = "afenda-brand",
  panelLead = "Use your workspace credentials to continue.",
  panelTitle = "Interface becomes infrastructure only after proof.",
}: P1NoirEditorialProps) {
  return (
    <AuthNoirShell
      editorialPresetId={editorialPresetId}
      eyebrow="Access Lane · /sign-in"
      subtitle="A quiet proving ground for governed enterprise ingress. Every surface is inspected before it reaches ERP."
      titleMuted="Sign"
      titlePrimary="In"
      variant="split"
    >
      <div className="space-y-6 p-8">
        <div>
          <p className={labNoirPanelLabelClassName}>Operator sequence</p>
          <h2 className="mt-4 lab-noir-serif text-2xl leading-tight text-foreground">
            {panelTitle}
          </h2>
          <p className="mt-3 text-muted-foreground text-sm leading-7">
            {panelLead}
          </p>
        </div>
        <AuthAccessFormFields showSignUpLink={false} />
      </div>
    </AuthNoirShell>
  );
}
