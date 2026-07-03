"use client";

/**
 * PAS-006D — maps MCP block ids to live React block components (metadata-workspace preview).
 */

import type { ComponentType } from "react";

import ErrorAccessDeniedPage01 from "../components-auth-shell/error-access-denied-page-01.js";
import ErrorAuthenticationPage01 from "../components-auth-shell/error-authentication-page-01.js";
import ErrorOauthPage01 from "../components-auth-shell/error-oauth-page-01.js";
import ErrorPasskeyPage01 from "../components-auth-shell/error-passkey-page-01.js";
import ErrorSessionExpiredPage01 from "../components-auth-shell/error-session-expired-page-01.js";
import ErrorSsoPage01 from "../components-auth-shell/error-sso-page-01.js";
import ForgotPasswordPage01 from "../components-auth-shell/forgot-password-page-01.js";
import ForgotPasswordSuccessPage01 from "../components-auth-shell/forgot-password-success-page-01.js";
import InviteAcceptPage01 from "../components-auth-shell/invite-accept-page-01.js";
import InviteConsumedPage01 from "../components-auth-shell/invite-consumed-page-01.js";
import InviteEmailMismatchPage01 from "../components-auth-shell/invite-email-mismatch-page-01.js";
import InviteExpiredPage01 from "../components-auth-shell/invite-expired-page-01.js";
import InviteInvalidPage01 from "../components-auth-shell/invite-invalid-page-01.js";
import InvitePage01 from "../components-auth-shell/invite-page-01.js";
import LoginPage04 from "../components-auth-shell/login-page-04.js";
import MfaPage01 from "../components-auth-shell/mfa-page-01.js";
import MfaRecoveryPage01 from "../components-auth-shell/mfa-recovery-page-01.js";
import OtpPage01 from "../components-auth-shell/otp-page-01.js";
import PasskeyPage01 from "../components-auth-shell/passkey-page-01.js";
import RegisterPage01 from "../components-auth-shell/register-page-01.js";
import ResetPasswordPage01 from "../components-auth-shell/reset-password-page-01.js";
import ResetPasswordSuccessPage01 from "../components-auth-shell/reset-password-success-page-01.js";
import SecurityReviewPage01 from "../components-auth-shell/security-review-page-01.js";
import SsoPage01 from "../components-auth-shell/sso-page-01.js";
import VerifyEmailExpiredPage01 from "../components-auth-shell/verify-email-expired-page-01.js";
import VerifyEmailPage01 from "../components-auth-shell/verify-email-page-01.js";
import VerifyEmailSentPage01 from "../components-auth-shell/verify-email-sent-page-01.js";
import VerifyEmailSuccessPage01 from "../components-auth-shell/verify-email-success-page-01.js";
import AccountSettings01Block from "../components-layouts/account-settings-01/account-settings-01.js";
import HeroSection01Block from "../components-layouts/hero-section-01/hero-section-01.js";
import { FLAT_BLOCK_STORY_REGISTRY } from "../storybook/block-flat-story.registry.js";
import {
  MCP_SEED_BLOCK_IDS,
  type McpSeedBlockId,
} from "./mcp-seed-block-manifest.js";
import { SURFACE_TEMPLATE_REGISTRY } from "./surface-template.registry.js";

export type StudioBlockComponent = ComponentType<Record<string, never>>;

function buildFlatBlockPreviewRegistry(): Record<
  McpSeedBlockId,
  StudioBlockComponent
> {
  const entries = {} as Record<McpSeedBlockId, StudioBlockComponent>;
  const seedIds = new Set<string>(MCP_SEED_BLOCK_IDS);

  for (const { slug, sample } of FLAT_BLOCK_STORY_REGISTRY) {
    if (!seedIds.has(slug)) {
      continue;
    }

    entries[slug as McpSeedBlockId] = sample as StudioBlockComponent;
  }

  return entries;
}

export const STUDIO_BLOCK_COMPONENT_REGISTRY = {
  ...buildFlatBlockPreviewRegistry(),
  "account-settings-01": AccountSettings01Block,
  "hero-section-01": HeroSection01Block,
  "login-page-04": LoginPage04,
  "forgot-password-page-01": ForgotPasswordPage01,
  "forgot-password-success-page-01": ForgotPasswordSuccessPage01,
  "register-page-01": RegisterPage01,
  "reset-password-page-01": ResetPasswordPage01,
  "reset-password-success-page-01": ResetPasswordSuccessPage01,
  "verify-email-page-01": VerifyEmailPage01,
  "verify-email-sent-page-01": VerifyEmailSentPage01,
  "verify-email-expired-page-01": VerifyEmailExpiredPage01,
  "verify-email-success-page-01": VerifyEmailSuccessPage01,
  "invite-page-01": InvitePage01,
  "invite-accept-page-01": InviteAcceptPage01,
  "invite-expired-page-01": InviteExpiredPage01,
  "invite-invalid-page-01": InviteInvalidPage01,
  "invite-consumed-page-01": InviteConsumedPage01,
  "invite-email-mismatch-page-01": InviteEmailMismatchPage01,
  "passkey-page-01": PasskeyPage01,
  "error-passkey-page-01": ErrorPasskeyPage01,
  "sso-page-01": SsoPage01,
  "error-sso-page-01": ErrorSsoPage01,
  "error-oauth-page-01": ErrorOauthPage01,
  "otp-page-01": OtpPage01,
  "mfa-page-01": MfaPage01,
  "mfa-recovery-page-01": MfaRecoveryPage01,
  "error-session-expired-page-01": ErrorSessionExpiredPage01,
  "error-access-denied-page-01": ErrorAccessDeniedPage01,
  "security-review-page-01": SecurityReviewPage01,
  "error-authentication-page-01": ErrorAuthenticationPage01,
} as const satisfies Record<McpSeedBlockId, StudioBlockComponent>;

export type StudioBlockComponentId =
  keyof typeof STUDIO_BLOCK_COMPONENT_REGISTRY;

export function isStudioBlockComponentId(
  blockId: string
): blockId is StudioBlockComponentId {
  return blockId in STUDIO_BLOCK_COMPONENT_REGISTRY;
}

export function resolveStudioBlockComponent(
  blockId: string
): StudioBlockComponent | undefined {
  if (!isStudioBlockComponentId(blockId)) {
    return;
  }

  return STUDIO_BLOCK_COMPONENT_REGISTRY[blockId];
}

/** Surface-template block ids that must resolve for template-bound metadata preview. */
export function listSurfaceTemplateBlockComponentIds(): readonly string[] {
  const blockIds = new Set<string>();

  for (const template of SURFACE_TEMPLATE_REGISTRY) {
    for (const binding of template.blockBindings) {
      blockIds.add(binding.blockId);
    }
  }

  return [...blockIds];
}

export function assertSurfaceTemplateBlockComponentsRegistered(): readonly string[] {
  const missing: string[] = [];

  for (const blockId of listSurfaceTemplateBlockComponentIds()) {
    if (!isStudioBlockComponentId(blockId)) {
      missing.push(blockId);
    }
  }

  return missing;
}

/** MCP seed block ids registered for metadata-workspace live preview. */
export function listStudioBlockPreviewIds(): readonly McpSeedBlockId[] {
  return MCP_SEED_BLOCK_IDS;
}

export function assertStudioBlockPreviewComponentsRegistered(): readonly string[] {
  const missing: string[] = [];

  for (const blockId of listStudioBlockPreviewIds()) {
    if (!isStudioBlockComponentId(blockId)) {
      missing.push(blockId);
    }
  }

  return missing;
}
