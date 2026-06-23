import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Separator,
} from "@afenda/ui";
import type {
  GovernedBadgeProps,
  GovernedUiComponentName,
} from "@afenda/ui/governance";
import { ImageIcon } from "lucide-react";

import {
  type AppShellActivityActor,
  type AppShellActivityItem,
  type AppShellActivityTagTone,
  defaultAppShellActivities,
} from "../data/app-shell.data";

const ACTIVITY_SUMMARY_ID_PREFIX = "app-shell-activity";
const DEFAULT_ACTIVITY_FEED_LABEL = "Team activity feed";
const DEFAULT_FILE_HREF = "#";

export type AppShellActivityFeedGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Separator"
>;

type GovernedActivityTagTone = NonNullable<GovernedBadgeProps["tone"]>;

export interface AppShellActivityFeedProps {
  /** Activity feed rows. Defaults to ERP demo data from `defaultAppShellActivities`. */
  readonly activities?: readonly AppShellActivityItem[];
  /** Optional layout class on the scroll container (plain HTML wrapper only). */
  readonly className?: string;
  /** Accessible name for the feed landmark. */
  readonly feedLabel?: string;
}

function activitySummaryId(activityId: string): string {
  return `${ACTIVITY_SUMMARY_ID_PREFIX}-${activityId}-summary`;
}

function joinClassNames(...values: readonly (string | undefined)[]): string {
  return values
    .filter((value) => value !== undefined && value.length > 0)
    .join(" ");
}

function ActivityActorAvatar({
  actor,
}: {
  readonly actor: AppShellActivityActor;
}) {
  return (
    <Avatar>
      <AvatarImage alt={actor.name} src={actor.avatarSrc} />
      <AvatarFallback>{actor.fallback}</AvatarFallback>
    </Avatar>
  );
}

function ActivitySummary({
  actorName,
  action,
  relativeTime,
  occurredAt,
}: {
  readonly actorName: string;
  readonly action: string;
  readonly relativeTime: string;
  readonly occurredAt: string;
}) {
  return (
    <div className="app-shell-activity-summary">
      <p>
        <span className="app-shell-activity-actor-name">{actorName}</span>{" "}
        {action}
      </p>
      <p>
        <time className="app-shell-activity-time" dateTime={occurredAt}>
          {relativeTime}
        </time>
      </p>
    </div>
  );
}

function ActivityMentionAttachment({ quote }: { readonly quote: string }) {
  return (
    <div className="app-shell-activity-mention">
      <p className="app-shell-activity-mention-quote">{quote}</p>
      <div
        aria-label="Reply to mention"
        className="app-shell-activity-reply-group"
        role="group"
      >
        <input
          aria-label="Reply message"
          className="app-shell-activity-reply-input"
          placeholder="Reply"
          type="text"
        />
        <button
          aria-label="Attach image"
          className="app-shell-activity-reply-attach"
          type="button"
        >
          <ImageIcon aria-hidden className="app-shell-activity-reply-icon" />
        </button>
      </div>
    </div>
  );
}

function ActivityFileInlineAttachment({
  fileHref,
  fileName,
  thumbnailAlt,
  thumbnailSrc,
}: {
  readonly fileHref: string;
  readonly fileName: string;
  readonly thumbnailAlt: string;
  readonly thumbnailSrc: string;
}) {
  return (
    <a className="app-shell-activity-file-inline" href={fileHref}>
      <img
        alt={thumbnailAlt}
        className="app-shell-activity-file-inline-thumb"
        src={thumbnailSrc}
      />
      <span className="app-shell-activity-file-inline-name">{fileName}</span>
    </a>
  );
}

function ActivityFileCardAttachment({
  fileHref,
  fileName,
  thumbnailAlt,
  thumbnailSrc,
}: {
  readonly fileHref: string;
  readonly fileName: string;
  readonly thumbnailAlt: string;
  readonly thumbnailSrc: string;
}) {
  return (
    <a className="app-shell-activity-file-card" href={fileHref}>
      <img
        alt={thumbnailAlt}
        className="app-shell-activity-file-card-thumb"
        src={thumbnailSrc}
      />
      <span className="app-shell-activity-file-card-name">{fileName}</span>
    </a>
  );
}

function ActivityTagGroup({
  tags,
}: {
  readonly tags: readonly {
    readonly label: string;
    readonly tone: AppShellActivityTagTone;
  }[];
}) {
  return (
    <div className="app-shell-activity-tag-group">
      {tags.map((tag) => (
        <Badge
          emphasis="soft"
          key={tag.label}
          tone={tag.tone satisfies GovernedActivityTagTone}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

function ActivityFeedAttachment({
  item,
}: {
  readonly item: AppShellActivityItem;
}) {
  switch (item.kind) {
    case "mention":
      return <ActivityMentionAttachment quote={item.quote} />;
    case "file-inline":
      return (
        <ActivityFileInlineAttachment
          fileHref={item.fileHref ?? DEFAULT_FILE_HREF}
          fileName={item.fileName}
          thumbnailAlt={item.thumbnailAlt}
          thumbnailSrc={item.thumbnailSrc}
        />
      );
    case "file-card":
      return (
        <ActivityFileCardAttachment
          fileHref={item.fileHref ?? DEFAULT_FILE_HREF}
          fileName={item.fileName}
          thumbnailAlt={item.thumbnailAlt}
          thumbnailSrc={item.thumbnailSrc}
        />
      );
    case "tags":
      return <ActivityTagGroup tags={item.tags} />;
    default:
      return null;
  }
}

function ActivityFeedRow({ item }: { readonly item: AppShellActivityItem }) {
  const summaryId = activitySummaryId(item.id);

  return (
    <article aria-labelledby={summaryId} className="app-shell-activity-row">
      <ActivityActorAvatar actor={item.actor} />
      <div className="app-shell-activity-row-body">
        <div id={summaryId}>
          <ActivitySummary
            action={item.action}
            actorName={item.actor.name}
            occurredAt={item.occurredAt}
            relativeTime={item.relativeTime}
          />
        </div>
        <ActivityFeedAttachment item={item} />
      </div>
    </article>
  );
}

function ActivityFeedEmptyState() {
  return (
    <p className="app-shell-activity-empty" role="status">
      No team activity yet. Module updates, approvals, and shared documents will
      appear here.
    </p>
  );
}

export function AppShellActivityFeed({
  activities = defaultAppShellActivities,
  feedLabel = DEFAULT_ACTIVITY_FEED_LABEL,
  className,
}: AppShellActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={joinClassNames("app-shell-activity-feed", className)}>
        <ActivityFeedEmptyState />
      </div>
    );
  }

  return (
    <div className={joinClassNames("app-shell-activity-feed", className)}>
      <ul
        aria-label={feedLabel}
        aria-live="polite"
        className="app-shell-activity-feed-list"
        role="feed"
      >
        {activities.map((item, index) => (
          <li key={item.id}>
            <ActivityFeedRow item={item} />
            {index < activities.length - 1 ? (
              <div className="app-shell-activity-separator" role="presentation">
                <Separator />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
