import { ImageIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, Badge, Separator } from "@afenda/ui";
import type { GovernedBadgeProps, GovernedUiComponentName } from "@afenda/ui/governance";

import {
  defaultAppShellActivities,
  type AppShellActivityActor,
  type AppShellActivityItem,
  type AppShellActivityTagTone,
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
  /** Accessible name for the feed landmark. */
  readonly feedLabel?: string;
  /** Optional layout class on the scroll container (plain HTML wrapper only). */
  readonly className?: string;
}

function activitySummaryId(activityId: string): string {
  return `${ACTIVITY_SUMMARY_ID_PREFIX}-${activityId}-summary`;
}

function joinClassNames(...values: readonly (string | undefined)[]): string {
  return values.filter((value) => value !== undefined && value.length > 0).join(" ");
}

function ActivityActorAvatar({ actor }: { readonly actor: AppShellActivityActor }) {
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
    <div className="text-muted-foreground flex flex-col items-start text-sm">
      <p>
        <span className="text-foreground font-semibold">{actorName}</span> {action}
      </p>
      <p>
        <time dateTime={occurredAt}>{relativeTime}</time>
      </p>
    </div>
  );
}

function ActivityMentionAttachment({ quote }: { readonly quote: string }) {
  return (
    <div className="bg-muted flex flex-col gap-4 rounded-md border px-4 py-2.5">
      <p className="text-sm font-medium">{quote}</p>
      <div
        aria-label="Reply to mention"
        className="bg-background flex items-center gap-2 rounded-md border px-3 py-2"
        role="group"
      >
        <input
          aria-label="Reply message"
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          placeholder="Reply"
          type="text"
        />
        <ImageIcon aria-hidden className="text-muted-foreground size-4 shrink-0" />
        <span className="sr-only">Attach image</span>
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
    <a
      className="bg-muted hover:bg-muted/80 flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors"
      href={fileHref}
    >
      <img alt={thumbnailAlt} className="h-5" src={thumbnailSrc} />
      <span className="text-sm font-medium">{fileName}</span>
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
    <a
      className="bg-muted hover:bg-muted/80 flex w-full items-center gap-4 rounded-md border px-4 py-2.5 transition-colors"
      href={fileHref}
    >
      <img alt={thumbnailAlt} className="size-8 rounded-sm" src={thumbnailSrc} />
      <span className="text-sm font-medium">{fileName}</span>
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
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.label}
          emphasis="soft"
          tone={tag.tone satisfies GovernedActivityTagTone}
        >
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

function ActivityFeedAttachment({ item }: { readonly item: AppShellActivityItem }) {
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
    <article aria-labelledby={summaryId} className="flex gap-4 px-4 py-3">
      <ActivityActorAvatar actor={item.actor} />
      <div className="flex w-full min-w-0 flex-col items-start gap-2.5">
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
    <p className="text-muted-foreground px-4 py-6 text-sm" role="status">
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
      <ul aria-label={feedLabel} className="list-none" role="feed">
        {activities.map((item, index) => (
          <li key={item.id}>
            <ActivityFeedRow item={item} />
            {index < activities.length - 1 ? (
              <div role="presentation">
                <Separator />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
