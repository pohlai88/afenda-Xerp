/** PAS-006A — @afenda/shadcn-studio public surface (product + selective L1 wire types). */

export const SHADCN_STUDIO_PACKAGE_VERSION = "0.0.0" as const;
export const SHADCN_STUDIO_PACKAGE_NAME = "@afenda/shadcn-studio" as const;
export const SHADCN_STUDIO_CSS_PATH = "./shadcn-studio.css" as const;

export {
  AdmincnNav,
  type AdmincnNavProps,
} from "./components-app-shell/admincn-nav.js";
export {
  AdmincnShell,
  type AdmincnShellProps,
} from "./components-app-shell/admincn-shell.js";
export {
  AppShell,
  type AppShellProps,
  resolveShell,
  type ShellSlug,
} from "./components-app-shell/resolve-shell.js";
export {
  AUTH_ACCESS_DENIED_PATH,
  AUTH_BACK_TO_WEBSITE_PATH,
  AUTH_ERROR_PATH,
  AUTH_FORGOT_PASSWORD_PATH,
  AUTH_FORGOT_PASSWORD_SUCCESS_PATH,
  AUTH_INVITE_ACCEPT_PATH,
  AUTH_INVITE_CONSUMED_PATH,
  AUTH_INVITE_EMAIL_MISMATCH_PATH,
  AUTH_INVITE_EXPIRED_PATH,
  AUTH_INVITE_INVALID_PATH,
  AUTH_INVITE_PATH,
  AUTH_MFA_PATH,
  AUTH_MFA_RECOVERY_PATH,
  AUTH_OAUTH_ERROR_PATH,
  AUTH_OTP_PATH,
  AUTH_PASSKEY_ERROR_PATH,
  AUTH_PASSKEY_PATH,
  AUTH_RESET_PASSWORD_PATH,
  AUTH_RESET_PASSWORD_SUCCESS_PATH,
  AUTH_RUNTIME_SYNC_PROFILE,
  AUTH_SECURITY_REVIEW_PATH,
  AUTH_SESSION_EXPIRED_PATH,
  AUTH_SIGN_IN_PATH,
  AUTH_SIGN_UP_PATH,
  AUTH_SSO_ERROR_PATH,
  AUTH_SSO_PATH,
  AUTH_VERIFY_EMAIL_EXPIRED_PATH,
  AUTH_VERIFY_EMAIL_PATH,
  AUTH_VERIFY_EMAIL_SENT_PATH,
  AUTH_VERIFY_EMAIL_SUCCESS_PATH,
  type AuthLoginMethodId,
  type AuthLoginMethodKind,
  type AuthLoginMethodManifestEntry,
  type AuthPageBlockId,
  type AuthShellFormLane,
  type AuthShellLane,
  assertCanonicalForgotPasswordForm,
  assertCanonicalInviteAcceptForm,
  assertCanonicalLoginForm,
  assertCanonicalMfaOtpForm,
  assertCanonicalMfaRecoveryForm,
  assertCanonicalRegisterForm,
  assertCanonicalResetPasswordForm,
  BETTER_AUTH_OAUTH_CALLBACK_PREFIX,
  BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT,
  BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
  BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
  BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX,
  BETTER_AUTH_SSO_SIGN_IN_ENDPOINT,
  CANONICAL_FORGOT_PASSWORD_FORM_ID,
  CANONICAL_LOGIN_FORM_ID,
  CANONICAL_MFA_OTP_FORM_ID,
  CANONICAL_MFA_RECOVERY_FORM_ID,
  CANONICAL_REGISTER_FORM_ID,
  CANONICAL_RESET_PASSWORD_FORM_ID,
  getLoginMethod,
  getLoginMethods,
  getLoginPageManifest,
  getLoginPageMethods,
  getPreLoginPageManifest,
  getPreLoginPageMethods,
  getRegisterPageManifest,
  getRegisterPageMethods,
  getRequiredLoginMethod,
  getResetPasswordPageManifest,
  getResetPasswordPageMethods,
  LOGIN_METHOD_MANIFEST,
  LOGIN_PAGE_BLOCK_IDS,
  LOGIN_PAGE_MANIFEST,
  type LoginPageBlockId,
  type LoginPageDesignPattern,
  type LoginPageManifestEntry,
  PRE_LOGIN_PAGE_BLOCK_IDS,
  PRE_LOGIN_PAGE_MANIFEST,
  type PreLoginPageBlockId,
  type PreLoginPageDesignPattern,
  type PreLoginPageManifestEntry,
  REGISTER_PAGE_BLOCK_IDS,
  REGISTER_PAGE_MANIFEST,
  RESET_PASSWORD_PAGE_BLOCK_IDS,
  RESET_PASSWORD_PAGE_MANIFEST,
  type RegisterPageBlockId,
  type RegisterPageDesignPattern,
  type RegisterPageManifestEntry,
  type ResetPasswordPageBlockId,
  type ResetPasswordPageDesignPattern,
  type ResetPasswordPageManifestEntry,
} from "./components-auth-shell/auth-shell-method-manifest.js";
export { default as ErrorAccessDeniedPage01 } from "./components-auth-shell/error-access-denied-page-01.js";
export { default as ErrorAuthenticationPage01 } from "./components-auth-shell/error-authentication-page-01.js";
export { default as ErrorOauthPage01 } from "./components-auth-shell/error-oauth-page-01.js";
export { default as ErrorPasskeyPage01 } from "./components-auth-shell/error-passkey-page-01.js";
export { default as ErrorSessionExpiredPage01 } from "./components-auth-shell/error-session-expired-page-01.js";
export { default as ErrorSsoPage01 } from "./components-auth-shell/error-sso-page-01.js";
export {
  default as ForgotPasswordFormV1,
  type ForgotPasswordFormV1Props,
} from "./components-auth-shell/forgot-password-form-v1.js";
export { default as ForgotPasswordPage01 } from "./components-auth-shell/forgot-password-page-01.js";
export { default as ForgotPasswordSuccessPage01 } from "./components-auth-shell/forgot-password-success-page-01.js";
export { default as InviteAcceptPage01 } from "./components-auth-shell/invite-accept-page-01.js";
export { default as InviteConsumedPage01 } from "./components-auth-shell/invite-consumed-page-01.js";
export { default as InviteEmailMismatchPage01 } from "./components-auth-shell/invite-email-mismatch-page-01.js";
export { default as InviteExpiredPage01 } from "./components-auth-shell/invite-expired-page-01.js";
export { default as InviteInvalidPage01 } from "./components-auth-shell/invite-invalid-page-01.js";
export { default as InvitePage01 } from "./components-auth-shell/invite-page-01.js";
export {
  default as LoginFormV1,
  type LoginFormV1Props,
} from "./components-auth-shell/login-form-v1.js";
export { default as LoginPage01 } from "./components-auth-shell/login-page-01.js";
export { default as LoginPage02 } from "./components-auth-shell/login-page-02.js";
export { default as LoginPage03 } from "./components-auth-shell/login-page-03.js";
export { default as LoginPage04 } from "./components-auth-shell/login-page-04.js";
export { default as LoginPage05 } from "./components-auth-shell/login-page-05.js";
export { default as LoginPage06 } from "./components-auth-shell/login-page-06.js";
export { default as LoginPage07 } from "./components-auth-shell/login-page-07.js";
export {
  default as MfaOtpFormV1,
  type MfaOtpFormV1Props,
} from "./components-auth-shell/mfa-otp-form-v1.js";
export { default as MfaPage01 } from "./components-auth-shell/mfa-page-01.js";
export {
  default as MfaRecoveryFormV1,
  type MfaRecoveryFormV1Props,
} from "./components-auth-shell/mfa-recovery-form-v1.js";
export { default as MfaRecoveryPage01 } from "./components-auth-shell/mfa-recovery-page-01.js";
export { default as OtpPage01 } from "./components-auth-shell/otp-page-01.js";
export { default as PasskeyPage01 } from "./components-auth-shell/passkey-page-01.js";
export {
  type AuthShellSurfaceV1Props,
  default as AuthShellSurfaceV1,
} from "./components-auth-shell/prelogin-bundle-01.js";
export {
  default as RegisterFormV1,
  type RegisterFormV1Props,
} from "./components-auth-shell/register-form-v1.js";
export { default as RegisterPage01 } from "./components-auth-shell/register-page-01.js";
export {
  default as ResetPasswordFormV1,
  type ResetPasswordFormV1Props,
} from "./components-auth-shell/reset-password-form-v1.js";
export { default as ResetPasswordPage01 } from "./components-auth-shell/reset-password-page-01.js";
export { default as ResetPasswordSuccessPage01 } from "./components-auth-shell/reset-password-success-page-01.js";
export { default as SecurityReviewPage01 } from "./components-auth-shell/security-review-page-01.js";
export { default as SsoPage01 } from "./components-auth-shell/sso-page-01.js";
export { default as VerifyEmailExpiredPage01 } from "./components-auth-shell/verify-email-expired-page-01.js";
export {
  default as VerifyEmailFormV1,
  type VerifyEmailFormV1Props,
} from "./components-auth-shell/verify-email-form-v1.js";
export { default as VerifyEmailPage01 } from "./components-auth-shell/verify-email-page-01.js";
export { default as VerifyEmailSentPage01 } from "./components-auth-shell/verify-email-sent-page-01.js";
export { default as VerifyEmailSuccessPage01 } from "./components-auth-shell/verify-email-success-page-01.js";
export { default as AccountSettings01Block } from "./components-layouts/account-settings-01/account-settings-01.js";
export { default as ChartEarningReportBlock } from "./components-layouts/chart-earning-report.js";
export { default as ChartSalesMetricsBlock } from "./components-layouts/chart-sales-metrics.js";
export { default as ChartTotalRevenueBlock } from "./components-layouts/chart-total-revenue.js";
export { default as AddPaymentMethodDialogBlock } from "./components-layouts/dashboard-dialog-03/dialog-add-payment-method.js";
export { default as VerifyDialogBlock } from "./components-layouts/dashboard-dialog-09/dialog-verify.js";
export { default as DatatableInvoiceBlock } from "./components-layouts/datatable-invoice.js";
export type { Item as DatatableProductRow } from "./components-layouts/datatable-product.js";
export { default as DatatableProductBlock } from "./components-layouts/datatable-product.js";
export type { Item as DatatableUserRow } from "./components-layouts/datatable-user.js";
export { default as DatatableUserBlock } from "./components-layouts/datatable-user.js";
export { default as ActivityDialogBlock } from "./components-layouts/dialog-activity.js";
export { default as SearchDialogBlock } from "./components-layouts/dialog-search.js";
export { default as LanguageDropdownBlock } from "./components-layouts/dropdown-language.js";
export { default as NotificationDropdownBlock } from "./components-layouts/dropdown-notification.js";
export { default as ProfileDropdownBlock } from "./components-layouts/dropdown-profile.js";
export {
  ERROR_PAGE_COPY_REGISTRY,
  type ErrorPageCopyWire,
} from "./components-layouts/error-page-shell.contract.js";
export { default as ErrorPageShellBlock } from "./components-layouts/error-page-shell.js";
export { default as HeroSection01Block } from "./components-layouts/hero-section-01/hero-section-01.js";
export { default as MenuTriggerBlock } from "./components-layouts/menu-trigger.js";
export {
  MorphingText,
  type MorphingTextProps,
} from "./components-layouts/morphing-text.js";
export { ProcurementListToolbarBlock } from "./components-layouts/procurement-list-toolbar-block.js";
export { ProcurementPurchaseOrdersTableBlock } from "./components-layouts/procurement-purchase-orders-table-block.js";
export { ProcurementRequisitionsTableBlock } from "./components-layouts/procurement-requisitions-table-block.js";
export { default as SidebarUserDropdownBlock } from "./components-layouts/sidebar-user-dropdown.js";
export { default as StatisticsActivityCardBlock } from "./components-layouts/statistics-activity-card.js";
export { default as StatisticsCard01Block } from "./components-layouts/statistics-card-01.js";
export { default as StatisticsCard02Block } from "./components-layouts/statistics-card-02.js";
export { default as StatisticsCard03Block } from "./components-layouts/statistics-card-03.js";
export { default as StatisticsCard04Block } from "./components-layouts/statistics-card-04.js";
export { default as StatisticsExpenseCardBlock } from "./components-layouts/statistics-expense-card.js";
export { default as StatisticsIncomeCardBlock } from "./components-layouts/statistics-income-card.js";
export { default as StatisticsLeadsCardBlock } from "./components-layouts/statistics-leads-card.js";
export { default as StatisticsLineTrendsCardBlock } from "./components-layouts/statistics-line-trends-card.js";
export { default as StatisticsOrdersProgressCardBlock } from "./components-layouts/statistics-orders-progress-card.js";
export { default as StatisticsProfileTrafficCardBlock } from "./components-layouts/statistics-profile-traffic-card.js";
export { default as StatisticsRevenueCardBlock } from "./components-layouts/statistics-revenue-card.js";
export { default as StatisticsSalesOverviewCardBlock } from "./components-layouts/statistics-sales-overview-card.js";
export { default as StatisticsTrendCardBlock } from "./components-layouts/statistics-trend-card.js";
export { SystemAdminAuditEventsTableBlock } from "./components-layouts/system-admin-audit-events-table-block.js";
export { SystemAdminDiagnosticsPanelBlock } from "./components-layouts/system-admin-diagnostics-panel-block.js";
export { SystemAdminListToolbarBlock } from "./components-layouts/system-admin-list-toolbar-block.js";
export { SystemAdminMembershipsTableBlock } from "./components-layouts/system-admin-memberships-table-block.js";
export { SystemAdminPermissionsTableBlock } from "./components-layouts/system-admin-permissions-table-block.js";
export { SystemAdminRolesTableBlock } from "./components-layouts/system-admin-roles-table-block.js";
export { SystemAdminSectionHeaderBlock } from "./components-layouts/system-admin-section-header-block.js";
export { SystemAdminSettingsTableBlock } from "./components-layouts/system-admin-settings-table-block.js";
export { SystemAdminUsersTableBlock } from "./components-layouts/system-admin-users-table-block.js";
export {
  default as UserProfileAvatar,
  type UserProfileAvatarProps,
} from "./components-layouts/user-profile-avatar.js";
export {
  default as UserProfileAvatarPicker,
  type UserProfileAvatarPickerProps,
  type UserProfileAvatarValue,
} from "./components-layouts/user-profile-avatar-picker.js";
export { default as WidgetPaymentHistoryBlock } from "./components-layouts/widget-payment-history.js";
export { default as WidgetSalesByCountriesBlock } from "./components-layouts/widget-sales-by-countries.js";
export { default as WidgetTotalEarningBlock } from "./components-layouts/widget-total-earning.js";
export { default as WidgetTransactionsBlock } from "./components-layouts/widget-transactions.js";
export { WorkspaceDashboardToolbarBlock } from "./components-layouts/workspace-dashboard-toolbar-block.js";
export { Button, buttonVariants } from "./components-ui/button.js";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components-ui/card.js";
export {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  type KanbanMoveEvent,
  KanbanOverlay,
} from "./components-ui/kanban.js";
export {
  userProfileAvatarFallbackClassName,
  userProfileAvatarHeroClassName,
  userProfileAvatarPanelClassName,
  userProfileAvatarPresetButtonClassName,
  userProfileAvatarPresetGridClassName,
  userProfileAvatarPresetIdleClassName,
  userProfileAvatarPresetSelectedClassName,
} from "./lib/user-profile-avatar.contract.js";
export {
  DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  getUserProfileAvatarPreset,
  resolveUserProfileAvatarFallback,
  resolveUserProfileAvatarImageSrc,
  USER_PROFILE_AVATAR_PRESETS,
  type UserProfileAvatarPreset,
  type UserProfileAvatarPresetId,
} from "./lib/user-profile-avatar.policy.js";
export {
  type AcceptanceCriterionResult,
  type AcceptanceRecordWire,
  assertAcceptanceRecordWire,
  isAcceptanceCriterionResult,
  isAcceptanceRecordWire,
  isSealEligibleLifecycleState,
  type SealEligibleLifecycleState,
} from "./meta-contracts/acceptance-record.contract.js";
export {
  type AcceptanceRecordSealFailure,
  type AcceptanceRecordSealResult,
  type AcceptanceRecordSealSuccess,
  validateAcceptanceRecordSeal,
} from "./meta-contracts/acceptance-record.validator.js";
export {
  type AppShellNavGroupWire,
  type AppShellNavItemWire,
  type AppShellOperatingContextWire,
  isAppShellNavGroupWire,
  isAppShellNavItemWire,
  isAppShellOperatingContextWire,
} from "./meta-contracts/app-shell.contract.js";
export {
  assertBlockDataContractWire,
  BLOCK_DATA_ACTION_KINDS,
  BLOCK_DATA_FIELD_KINDS,
  type BlockDataActionKind,
  type BlockDataActionWire,
  type BlockDataContractWire,
  type BlockDataFieldKind,
  type BlockDataFieldWire,
  isBlockDataActionKind,
  isBlockDataContractWire,
  isBlockDataFieldKind,
  isBlockDataFieldWire,
} from "./meta-contracts/block-data.contract.js";
export {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
  isBlockLifecycleState,
} from "./meta-contracts/block-lifecycle.contract.js";
export {
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
  type BlockSlotDomMarkerProps,
  blockSlotDomMarkerProps,
} from "./meta-contracts/block-slot-dom-marker.contract.js";
export {
  assertMetadataBindingContractWire,
  isMetadataBindingContractWire,
  isValidMetadataBindingPresentationKind,
  METADATA_BINDING_DENSITIES,
  METADATA_BINDING_PRESENTATION_KINDS,
  type MetadataBindingContractWire,
  type MetadataBindingDensity,
  type MetadataBindingFieldPresentationKind,
  type MetadataBindingFieldWire,
  type MetadataBindingStateKind,
  type MetadataBindingStateTemplateWire,
  type MetadataBindingTableColumnWire,
} from "./meta-contracts/metadata-binding.contract.js";
export {
  isMetadataBindingWaiverReason,
  isMetadataBindingWaiverWire,
  type MetadataBindingWaiverReason,
  type MetadataBindingWaiverWire,
} from "./meta-contracts/metadata-binding-waiver.contract.js";
export {
  assertSurfaceTemplateContractWire,
  isSurfaceTemplateClass,
  isSurfaceTemplateContractWire,
  SURFACE_TEMPLATE_CLASSES,
  type SurfaceTemplateBlockBindingWire,
  type SurfaceTemplateClass,
  type SurfaceTemplateContractWire,
} from "./meta-contracts/surface-template.contract.js";
export {
  ACCEPTANCE_RECORD_REGISTRY,
  ACCEPTANCE_RECORD_SEALED_AT,
  ACCEPTANCE_RECORD_SEALED_BY,
  ACPA_PROFILE_VERSION,
  assertAllAcceptanceRecordsSealed,
  getAcceptanceRecordByBlockId,
  getAcceptanceRecordById,
  listAcceptanceRecordIds,
} from "./meta-registry/acceptance-record.registry.js";
export {
  assertMetadataBindingCoverage,
  type MetadataBindingCoverageResult,
  type MetadataBindingCoverageRow,
  summarizeMetadataBindingCoverage,
} from "./meta-registry/assert-metadata-binding-coverage.js";
export { isValidBlockLifecycleTransition } from "./meta-registry/block-lifecycle.js";
export {
  assertBlockLifecycleRegistryValid,
  BLOCK_LIFECYCLE_REGISTRY,
  type BlockLifecycleRegistryEntry,
  type BlockLifecycleTransitionFailure,
  type BlockLifecycleTransitionResult,
  type BlockLifecycleTransitionSuccess,
  buildInitialBlockLifecycleRegistry,
  transitionBlockLifecycleEntry,
  transitionBlockLifecycleRegistry,
} from "./meta-registry/block-lifecycle-mutation.js";
export {
  BLOCK_DATA_CONTRACT_REGISTRY,
  BLOCK_SLOT_REGISTRY,
  type BlockSlotEntry,
  type BlockSlotRole,
  getBlockDataContractForBlockId,
  getBlockSlotsForBlockId,
} from "./meta-registry/block-slot.registry.js";
export { buildMetadataBindingFromDataContracts } from "./meta-registry/build-metadata-binding-from-data-contracts.js";
export { buildPresentationInventoryFromParity } from "./meta-registry/build-presentation-inventory-from-parity.js";
export {
  MCP_SEED_BLOCK_IDS,
  MCP_SEED_BLOCK_MANIFEST,
  type McpSeedBlockId,
  type McpSeedBlockManifestEntry,
} from "./meta-registry/mcp-seed-block-manifest.js";
export {
  getMetadataBindingByBlockId,
  getMetadataBindingById,
  METADATA_BINDING_REGISTRY,
} from "./meta-registry/metadata-binding.registry.js";
export {
  METADATA_BINDING_MODULE_KV_ID_BY_SLUG,
  type MetadataBindingModuleAssignment,
  resolveMetadataBindingModuleAssignment,
} from "./meta-registry/metadata-binding-module-assignment.js";
export {
  applyMetadataBindingOverrides,
  METADATA_BINDING_OVERRIDE_REGISTRY,
  type MetadataBindingOverrideReason,
  type MetadataBindingOverrideWire,
} from "./meta-registry/metadata-binding-overrides.registry.js";
export {
  getMetadataBindingWaiverByBlockId,
  isMetadataBindingWaivedBlockId,
  METADATA_BINDING_WAIVER_REGISTRY,
} from "./meta-registry/metadata-binding-waiver.registry.js";
export {
  PRESENTATION_INVENTORY_REGISTRY,
  type PresentationInventoryEntry,
  type PresentationLayerKind,
} from "./meta-registry/presentation-inventory.registry.js";
export {
  assertStudioBlockPreviewComponentsRegistered,
  assertSurfaceTemplateBlockComponentsRegistered,
  isStudioBlockComponentId,
  listStudioBlockPreviewIds,
  listSurfaceTemplateBlockComponentIds,
  resolveStudioBlockComponent,
  STUDIO_BLOCK_COMPONENT_REGISTRY,
  type StudioBlockComponent,
  type StudioBlockComponentId,
} from "./meta-registry/studio-block-component.registry.js";
export {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
  type StudioBlockParityEntry,
  type StudioBlockParityStatus,
  type StudioBlockParitySummary,
} from "./meta-registry/studio-block-parity.registry.js";
export {
  assertSurfaceTemplateBlockDataCoverage,
  assertSurfaceTemplateMetadataBinding,
  getSurfaceTemplateById,
  SURFACE_TEMPLATE_REGISTRY,
} from "./meta-registry/surface-template.registry.js";
export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./theme/apply-theme-preset.js";
export {
  ErpPresentationProviders,
  type ErpPresentationProvidersProps,
} from "./theme/erp-presentation-providers.js";
export {
  initialSettings,
  type Settings,
} from "./theme/settings.contract.js";
export {
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./theme/settings-context.js";
export {
  parseStoredSettings,
  readStoredSettings,
  type StoredSettings,
  serializeSettings,
} from "./theme/settings-storage.js";
export {
  themeConfig,
  themeConfig as themeConfigValues,
} from "./theme/theme-config.js";
export { ThemeCustomizer } from "./theme/theme-customizer.js";
export {
  assertThemePresetSlug,
  isNamedThemePresetSlug,
  isThemeMode,
  isThemePresetSlug,
  isThemeRadius,
  isThemeScale,
  NAMED_THEME_PRESET_SLUGS,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  RADIUS_VALUES,
  THEME_LAYOUTS,
  THEME_MODES,
  THEME_PRESET_SLUGS,
  THEME_RADII,
  THEME_SCALES,
  THEME_SIDEBAR_COLLAPSIBLES,
  THEME_SIDEBAR_VARIANTS,
  type ThemeFont,
  type ThemeLayout,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetMap,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeSidebarCollapsible,
  type ThemeSidebarVariant,
  type ThemeStyleProps,
  type ThemeStyles,
} from "./theme/theme-preset.contract.js";
export { themePresets } from "./theme/theme-presets.js";
