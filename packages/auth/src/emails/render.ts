import { render } from "@react-email/render";
import { createElement, type ReactElement } from "react";

import type { AuthTransactionalEmailMessage } from "../auth.email.contract.js";
import { AuthInviteEmail } from "./templates/auth-invite.js";
import { AuthResetEmail } from "./templates/auth-reset.js";
import { AuthTwoFactorOtpEmail } from "./templates/auth-two-factor-otp.js";
import { AuthVerifyEmail } from "./templates/auth-verify.js";

interface AuthEmailRenderInput {
  readonly name: string;
  readonly subject: string;
  readonly to: string;
  readonly url: string;
}

type AuthEmailTemplateProps = {
  readonly name: string;
  readonly url: string;
};

type AuthEmailTemplate = (props: AuthEmailTemplateProps) => ReactElement;

async function renderAuthEmailMessage(
  Template: AuthEmailTemplate,
  input: AuthEmailRenderInput
): Promise<AuthTransactionalEmailMessage> {
  const element = createElement(Template, {
    name: input.name,
    url: input.url,
  });
  const html = await render(element);
  const text = await render(element, { plainText: true });

  return {
    to: input.to,
    subject: input.subject,
    html,
    text,
  };
}

export function resolveAuthEmailDisplayName(
  email: string,
  name?: string
): string {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : email;
}

export function renderAuthInvitationEmailMessage(
  input: AuthEmailRenderInput
): Promise<AuthTransactionalEmailMessage> {
  return renderAuthEmailMessage(AuthInviteEmail, input);
}

export function renderAuthVerificationEmailMessage(
  input: AuthEmailRenderInput
): Promise<AuthTransactionalEmailMessage> {
  return renderAuthEmailMessage(AuthVerifyEmail, input);
}

export function renderAuthPasswordResetEmailMessage(
  input: AuthEmailRenderInput
): Promise<AuthTransactionalEmailMessage> {
  return renderAuthEmailMessage(AuthResetEmail, input);
}

interface AuthTwoFactorOtpEmailRenderInput {
  readonly name: string;
  readonly otp: string;
  readonly subject: string;
  readonly to: string;
}

export async function renderAuthTwoFactorOtpEmailMessage(
  input: AuthTwoFactorOtpEmailRenderInput
): Promise<AuthTransactionalEmailMessage> {
  const element = createElement(AuthTwoFactorOtpEmail, {
    name: input.name,
    otp: input.otp,
  });
  const html = await render(element);
  const text = await render(element, { plainText: true });

  return {
    to: input.to,
    subject: input.subject,
    html,
    text,
  };
}
