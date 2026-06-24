import {
  AngryIcon,
  FrownIcon,
  LaughIcon,
  type LucideIcon,
  MehIcon,
  SmileIcon,
} from "lucide-react";

export interface DialogRatingOption {
  readonly Icon: LucideIcon;
  readonly label: string;
  readonly value: string;
}

export const DIALOG_RATING_TITLE = "Help us improve the Afenda ERP experience";

export const DIALOG_RATING_LEGEND =
  "How would you describe your experience with the platform today?";

export const DIALOG_RATING_TRIGGER_LABEL = "Share feedback";

export const DIALOG_RATING_MESSAGE_PLACEHOLDER = "Type your message here.";

export const DIALOG_RATING_MESSAGE_LABEL = "Feedback message";

export const DIALOG_RATING_CHAR_COUNT = "500/500 characters left";

export const DIALOG_RATING_CONSENT_LABEL =
  "I consent to Afenda contacting me based on my feedback";

export const DIALOG_RATING_CANCEL_LABEL = "Cancel";

export const DIALOG_RATING_SUBMIT_LABEL = "Submit";

export const DIALOG_RATING_DEFAULT_VALUE = "5";

export const DIALOG_RATING_OPTIONS: readonly DialogRatingOption[] = [
  { value: "1", label: "Very dissatisfied", Icon: AngryIcon },
  { value: "2", label: "Dissatisfied", Icon: FrownIcon },
  { value: "3", label: "Neutral", Icon: MehIcon },
  { value: "4", label: "Satisfied", Icon: SmileIcon },
  { value: "5", label: "Very satisfied", Icon: LaughIcon },
];
