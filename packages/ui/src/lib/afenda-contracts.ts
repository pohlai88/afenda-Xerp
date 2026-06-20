import type {
  Density,
  GovernedRadius,
  GovernedShadow,
  GovernedSize,
  StatusTone,
  VariantEmphasis,
  VariantIntent,
} from "../governance";

export interface AfendaButtonProps {
  intent?: VariantIntent;
  emphasis?: VariantEmphasis;
  size?: GovernedSize;
  density?: Density;
  presentation?: "default" | "icon";
}

export interface AfendaBadgeProps {
  tone?: StatusTone;
  emphasis?: VariantEmphasis;
  density?: Density;
  size?: GovernedSize;
}

export interface AfendaAlertProps {
  tone?: StatusTone;
}

export interface AfendaCardProps {
  density?: Density;
  radius?: GovernedRadius;
  shadow?: GovernedShadow;
}
