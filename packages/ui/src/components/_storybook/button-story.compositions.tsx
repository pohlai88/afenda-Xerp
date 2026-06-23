import { BellIcon, CheckIcon, CopyIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Spinner } from "../spinner";

export function CopyRecordLinkButton() {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      emphasis="outline"
      intent="secondary"
      onClick={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      size="sm"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}

export function AsyncSubmitButton() {
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle");

  const handleClick = () => {
    if (phase !== "idle") {
      return;
    }
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1500);
    setTimeout(() => setPhase("idle"), 3500);
  };

  const isLoading = phase === "loading";

  return (
    <Button
      aria-label={
        isLoading
          ? "Submitting for approval"
          : phase === "success"
            ? "Submitted for approval"
            : "Submit for approval"
      }
      disabled={isLoading}
      emphasis="solid"
      intent="primary"
      onClick={handleClick}
      size="sm"
      {...(isLoading ? { state: "loading" as const } : {})}
    >
      {isLoading ? (
        <>
          <Spinner />
          Submitting…
        </>
      ) : phase === "success" ? (
        <>
          <CheckIcon />
          Submitted
        </>
      ) : (
        <>
          <SendIcon />
          Submit for approval
        </>
      )}
    </Button>
  );
}

export function NotificationBellButton({
  unreadCount = 5,
}: {
  readonly unreadCount?: number;
}) {
  return (
    <div className="relative inline-flex">
      <Button
        aria-label={`Notifications, ${unreadCount} unread`}
        emphasis="ghost"
        intent="quiet"
        presentation="icon"
        size="sm"
      >
        <BellIcon />
      </Button>
      <div className="absolute -top-1 -right-1">
        <Badge emphasis="solid" size="sm" tone="danger">
          {unreadCount}
        </Badge>
      </div>
    </div>
  );
}
