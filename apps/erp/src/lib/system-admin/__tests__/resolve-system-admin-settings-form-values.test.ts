import { describe, expect, it } from "vitest";

import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";
import { resolveSystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";
import { SYSTEM_ADMIN_SETTINGS_SECTION_COPY } from "@/lib/system-admin/system-admin-settings.copy.contract";

describe("resolveSystemAdminSettingsFormValues", () => {
  it("maps operating context into serializable read-only field rows per section", () => {
    const operatingContext = createModuleRouteOperatingContext();
    const formValues = resolveSystemAdminSettingsFormValues(operatingContext);

    expect(formValues.sections).toHaveLength(
      SYSTEM_ADMIN_SETTINGS_SECTION_COPY.length
    );

    const tenantSection = formValues.sections.find(
      (section) => section.sectionId === "tenant"
    );
    expect(tenantSection?.title).toBe("Customer account / tenant");
    expect(tenantSection?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldId: "tenant.displayName",
          value: "Acme",
        }),
        expect.objectContaining({
          fieldId: "tenant.slug",
          value: "acme",
        }),
        expect.objectContaining({
          fieldId: "tenant.tenantId",
          value: operatingContext.tenant.tenantId,
        }),
      ])
    );

    const permissionSection = formValues.sections.find(
      (section) => section.sectionId === "permission-scope"
    );
    expect(permissionSection?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldId: "permissionScope.grantScopeType",
          value: "company",
        }),
        expect.objectContaining({
          fieldId: "permissionScope.companyId",
          value: operatingContext.permissionScope.companyId,
        }),
      ])
    );
  });

  it("renders an em dash when permission scope companyId is null", () => {
    const operatingContext = createModuleRouteOperatingContext();
    const formValues = resolveSystemAdminSettingsFormValues({
      ...operatingContext,
      permissionScope: {
        ...operatingContext.permissionScope,
        companyId: null,
      },
    });

    const companyField = formValues.sections
      .flatMap((section) => section.fields)
      .find((field) => field.fieldId === "permissionScope.companyId");

    expect(companyField?.value).toBe("—");
  });
});
