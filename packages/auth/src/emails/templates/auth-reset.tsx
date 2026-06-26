import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactElement } from "react";

export interface AuthResetEmailProps {
  readonly name: string;
  readonly url: string;
}

export function AuthResetEmail({
  name,
  url,
}: AuthResetEmailProps): ReactElement {
  return (
    <Html>
      <Head />
      <Preview>Reset your Afenda ERP password</Preview>
      <Body>
        <Container>
          <Section>
            <Text>Hello {name},</Text>
            <Text>Reset your password using the link below.</Text>
            <Button href={url}>Reset password</Button>
            <Text>
              If you did not request a reset, you can ignore this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

AuthResetEmail.PreviewProps = {
  name: "Test User",
  url: "https://erp.example.com/api/auth/reset-password/token",
} satisfies AuthResetEmailProps;
