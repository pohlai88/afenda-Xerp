import { describe, expect, it } from "vitest";
import { AuthShellEntryBrand } from "../auth-shell-brand.compound.js";
import { AuthShellEntry } from "../auth-shell-entry.compound.js";
import { AuthShellError } from "../auth-shell-error.compound.js";

describe("auth-shell compound components", () => {
  it("exposes entry layout subcomponents", () => {
    expect(AuthShellEntry.Root).toBeTypeOf("function");
    expect(AuthShellEntry.Card).toBeTypeOf("function");
    expect(AuthShellEntry.SkipLink).toBeTypeOf("function");
    expect(AuthShellEntry.FormColumn).toBeTypeOf("function");
    expect(AuthShellEntry.FormColumnBackdrop).toBeTypeOf("function");
    expect(AuthShellEntry.FormInner).toBeTypeOf("function");
    expect(AuthShellEntry.FormKicker).toBeTypeOf("function");
    expect(AuthShellEntry.FormHeader).toBeTypeOf("function");
    expect(AuthShellEntry.FormDivider).toBeTypeOf("function");
    expect(AuthShellEntry.FormBody).toBeTypeOf("function");
    expect(AuthShellEntry.FormFooter).toBeTypeOf("function");
  });

  it("exposes brand panel subcomponents", () => {
    expect(AuthShellEntryBrand.Root).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Background).toBeTypeOf("function");
    expect(AuthShellEntryBrand.BackgroundArtifact).toBeTypeOf("function");
    expect(AuthShellEntryBrand.BackgroundScrim).toBeTypeOf("function");
    expect(AuthShellEntryBrand.BackgroundGrain).toBeTypeOf("function");
    expect(AuthShellEntryBrand.ArtifactPlane).toBeTypeOf("function");
    expect(AuthShellEntryBrand.AccentRule).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Copy).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Kicker).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Title).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Description).toBeTypeOf("function");
    expect(AuthShellEntryBrand.ArtifactImage).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Preview).toBeTypeOf("function");
    expect(AuthShellEntryBrand.PreviewFrame).toBeTypeOf("function");
    expect(AuthShellEntryBrand.PreviewCaption).toBeTypeOf("function");
    expect(AuthShellEntryBrand.PreviewImage).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Lockup).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Manifesto).toBeTypeOf("function");
    expect(AuthShellEntryBrand.Capabilities).toBeTypeOf("function");
    expect(AuthShellEntryBrand).not.toHaveProperty("BackgroundMesh");
    expect(AuthShellEntryBrand).not.toHaveProperty("BackgroundShapes");
  });

  it("exposes error surface subcomponents", () => {
    expect(AuthShellError.Root).toBeTypeOf("function");
    expect(AuthShellError.Backdrop).toBeTypeOf("function");
    expect(AuthShellError.Alert).toBeTypeOf("function");
    expect(AuthShellError.IllustrationFrame).toBeTypeOf("function");
    expect(AuthShellError.Illustration).toBeTypeOf("function");
    expect(AuthShellError.Copy).toBeTypeOf("function");
    expect(AuthShellError.StatusPulse).toBeTypeOf("function");
    expect(AuthShellError.Eyebrow).toBeTypeOf("function");
    expect(AuthShellError.Title).toBeTypeOf("function");
    expect(AuthShellError.Description).toBeTypeOf("function");
    expect(AuthShellError.Actions).toBeTypeOf("function");
  });
});
