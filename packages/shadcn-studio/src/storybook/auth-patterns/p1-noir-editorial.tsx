import { AuthAccessFormFields } from "../auth-access-form-fields.js";
import type { EditorialNoirPresetId } from "../auth-noir-shell.js";
import { AuthNoirShell } from "../auth-noir-shell.js";
import { labNoirPanelLabelClassName } from "../presentation-lab/presentation-lab.noir.contract.js";

export type P1NoirEditorialProps = {
  readonly editorialPresetId?: EditorialNoirPresetId;
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
          <h2 className="lab-noir-serif mt-4 text-2xl text-foreground leading-tight">
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
