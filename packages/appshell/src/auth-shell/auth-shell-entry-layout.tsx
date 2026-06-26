import {
  AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW,
  AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING,
  type AuthShellEntryPageProps,
} from "./auth-shell.contract.js";
import { AuthShellEntryBrandPanel } from "./auth-shell-brand-panel.js";
import { AuthShellEntry } from "./auth-shell-entry.compound.js";

export { AuthShellEntry } from "./auth-shell-entry.compound.js";

/**
 * Canonical authentication entry page shell.
 *
 * Ownership:
 * - Composes the two-plane auth layout.
 * - Provides the default Memory Gate brand panel.
 * - Provides the governed form column structure.
 *
 * Does not own:
 * - form mutation behavior
 * - auth provider calls
 * - session validation
 * - redirect policy
 * - provider error mapping
 */
export function AuthShellEntryPage({
  brandPanel,
  children,
  formDescription = AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION,
  formEyebrow = AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW,
  formFooter,
  formHeading = AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING,
}: AuthShellEntryPageProps) {
  return (
    <AuthShellEntry.Root>
      <AuthShellEntry.SkipLink />

      <AuthShellEntry.Card>
        {brandPanel ?? <AuthShellEntryBrandPanel />}

        <AuthShellEntry.FormColumn>
          <AuthShellEntry.FormInner>
            <AuthShellEntry.FormHeader
              description={formDescription}
              eyebrow={formEyebrow}
              heading={formHeading}
            />

            <AuthShellEntry.FormBody>{children}</AuthShellEntry.FormBody>

            {formFooter ? (
              <AuthShellEntry.FormFooter>
                {formFooter}
              </AuthShellEntry.FormFooter>
            ) : null}
          </AuthShellEntry.FormInner>
        </AuthShellEntry.FormColumn>
      </AuthShellEntry.Card>
    </AuthShellEntry.Root>
  );
}
