import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { cn } from "../../lib/cn";
import type {
  NonReadyViewSurfaceState,
  SettingsSurfaceItem,
  SettingsSurfaceProps,
  SettingsSurfaceSection,
  ViewStateMessage,
} from "../../types/views";
import { SETTINGS_SURFACE_SLOTS } from "../../types/views";

export type { SettingsSurfaceProps } from "../../types/views";

const DEFAULT_SETTINGS_STATE_MESSAGES = {
  empty: {
    description: "No settings are available for this surface.",
    title: "No settings",
  },
  error: {
    description: "The settings surface could not be rendered.",
    title: "Settings unavailable",
  },
  loading: {
    description: "The settings surface is being prepared.",
    title: "Loading settings",
  },
  unavailable: {
    description: "These settings are not available in the current context.",
    title: "Settings unavailable",
  },
} satisfies Record<NonReadyViewSurfaceState, ViewStateMessage>;

export function settingsSurfaceClassName({
  className,
}: Pick<SettingsSurfaceProps, "className"> = {}): string {
  return cn("grid gap-4", className);
}

function hasSettingsSections(
  sections: readonly SettingsSurfaceSection[]
): boolean {
  return sections.some((section) => section.items.length > 0);
}

function getSettingsStateMessage({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: SettingsSurfaceProps["stateMessages"];
}): ViewStateMessage {
  return stateMessages?.[state] ?? DEFAULT_SETTINGS_STATE_MESSAGES[state];
}

function SettingsSurfaceState({
  state,
  stateMessages,
}: {
  readonly state: NonReadyViewSurfaceState;
  readonly stateMessages: SettingsSurfaceProps["stateMessages"];
}) {
  const message = getSettingsStateMessage({ state, stateMessages });
  const isError = state === "error";

  return (
    <>
      <div data-slot={SETTINGS_SURFACE_SLOTS.state}>
        <Alert
          aria-busy={state === "loading" ? true : undefined}
          aria-live={isError ? "assertive" : "polite"}
          data-state={state}
          role={isError ? "alert" : "status"}
          variant={isError ? "destructive" : "default"}
        >
          <AlertTitle>{message.title}</AlertTitle>
          {message.description == null ? null : (
            <AlertDescription>{message.description}</AlertDescription>
          )}
        </Alert>
      </div>
      {message.action == null ? null : (
        <div className="mt-3" data-slot={SETTINGS_SURFACE_SLOTS.stateAction}>
          {message.action}
        </div>
      )}
    </>
  );
}

function SettingsSurfaceItemRow({
  item,
}: {
  readonly item: SettingsSurfaceItem;
}) {
  return (
    <div
      className="grid gap-3 border-border border-t py-4 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
      data-slot={SETTINGS_SURFACE_SLOTS.item}
    >
      <div className="grid gap-1">
        <div
          className="font-medium text-sm"
          data-slot={SETTINGS_SURFACE_SLOTS.itemLabel}
        >
          {item.label}
        </div>
        {item.description == null ? null : (
          <p
            className="text-muted-foreground text-sm"
            data-slot={SETTINGS_SURFACE_SLOTS.itemDescription}
          >
            {item.description}
          </p>
        )}
      </div>
      {item.control == null ? null : (
        <div data-slot={SETTINGS_SURFACE_SLOTS.itemControl}>{item.control}</div>
      )}
    </div>
  );
}

function SettingsSurfaceSectionCard({
  section,
}: {
  readonly section: SettingsSurfaceSection;
}) {
  return (
    <div data-slot={SETTINGS_SURFACE_SLOTS.section}>
      <Card>
        <CardHeader>
          <div data-slot={SETTINGS_SURFACE_SLOTS.sectionTitle}>
            <CardTitle>{section.title}</CardTitle>
          </div>
          {section.description == null ? null : (
            <div data-slot={SETTINGS_SURFACE_SLOTS.sectionDescription}>
              <CardDescription>{section.description}</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {section.items.map((item) => (
            <SettingsSurfaceItemRow item={item} key={item.id} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsSurface({
  className,
  description,
  label,
  sections = [],
  state,
  stateMessages,
  title,
  ...props
}: SettingsSurfaceProps) {
  const surfaceId = useId();
  const titleId = `${surfaceId}-title`;
  const descriptionId =
    description == null ? undefined : `${surfaceId}-description`;
  const resolvedState =
    state ?? (hasSettingsSections(sections) ? "ready" : "empty");
  const consumerAriaLabel = props["aria-label"];
  const consumerDescribedBy = props["aria-describedby"];
  const consumerLabelledBy = props["aria-labelledby"];
  const ariaLabelledBy =
    consumerLabelledBy ??
    (consumerAriaLabel == null && label == null ? titleId : undefined);

  return (
    <section
      {...props}
      aria-describedby={consumerDescribedBy ?? descriptionId}
      aria-label={consumerAriaLabel ?? label}
      aria-labelledby={ariaLabelledBy}
      className={settingsSurfaceClassName({ className })}
      data-slot={SETTINGS_SURFACE_SLOTS.root}
      data-state={resolvedState}
    >
      <div className="grid gap-1">
        <h2 data-slot={SETTINGS_SURFACE_SLOTS.title} id={titleId}>
          {title}
        </h2>
        {description == null ? null : (
          <p
            className="text-muted-foreground text-sm"
            data-slot={SETTINGS_SURFACE_SLOTS.description}
            id={descriptionId}
          >
            {description}
          </p>
        )}
      </div>
      <div className="grid gap-4" data-slot={SETTINGS_SURFACE_SLOTS.content}>
        {resolvedState === "ready" ? (
          sections.map((section) => (
            <SettingsSurfaceSectionCard key={section.id} section={section} />
          ))
        ) : (
          <SettingsSurfaceState
            state={resolvedState}
            stateMessages={stateMessages}
          />
        )}
      </div>
    </section>
  );
}
