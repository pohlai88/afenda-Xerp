"use client";

import {
  blockFeedbackResult,
  pageFeedbackResult,
  type ActionResponse,
  type BlockFeedback,
  type PageFeedback,
} from "@/components/feedback/schema";
import { resolveDocsFeedbackCopy } from "@/lib/docs-feedback.copy";
import { cn } from "@/lib/cn";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";
import { usePathname } from "fumadocs-core/framework";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "fumadocs-ui/components/ui/collapsible";
import { cva } from "class-variance-authority";
import { CornerDownRightIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  type HTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition,
} from "react";

const rateButtonVariants = cva(
  "inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium border text-sm [&_svg]:size-4 disabled:cursor-not-allowed",
  {
    variants: {
      active: {
        true: "bg-fd-accent text-fd-accent-foreground [&_svg]:fill-current",
        false: "text-fd-muted-foreground",
      },
    },
  }
);

function resolveLocaleFromPathname(pathname: string): DocsLocale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && (docsLocales as readonly string[]).includes(segment)
    ? (segment as DocsLocale)
    : docsDefaultLocale;
}

/** Page-level feedback UI — attach at the bottom of docs pages. */
export function Feedback({
  onSendAction,
}: {
  onSendAction: (feedback: PageFeedback) => Promise<ActionResponse>;
}) {
  const pathname = usePathname();
  const t = resolveDocsFeedbackCopy(resolveLocaleFromPathname(pathname));
  const { previous, setPrevious } = useSubmissionStorage(pathname, (value) => {
    const result = pageFeedbackResult.safeParse(value);
    return result.success ? result.data : null;
  });
  const [opinion, setOpinion] = useState<"good" | "bad" | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e?: SyntheticEvent) {
    if (opinion == null) {
      return;
    }

    startTransition(async () => {
      const feedback: PageFeedback = {
        url: location.href,
        opinion,
        message,
      };

      const response = await onSendAction(feedback);
      setPrevious({
        response,
        ...feedback,
      });
      setMessage("");
      setOpinion(null);
    });

    e?.preventDefault();
  }

  const activeOpinion = previous?.opinion ?? opinion;

  return (
    <Collapsible
      className="border-y py-3"
      onOpenChange={(open) => {
        if (!open) {
          setOpinion(null);
        }
      }}
      open={opinion !== null || previous !== null}
    >
      <div className="flex flex-row items-center gap-2">
        <p className="pe-2 font-medium text-sm">{t.pagePrompt}</p>
        <button
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "good",
            })
          )}
          disabled={previous !== null}
          onClick={() => {
            setOpinion("good");
          }}
          type="button"
        >
          <ThumbsUp />
          {t.good}
        </button>
        <button
          className={cn(
            rateButtonVariants({
              active: activeOpinion === "bad",
            })
          )}
          disabled={previous !== null}
          onClick={() => {
            setOpinion("bad");
          }}
          type="button"
        >
          <ThumbsDown />
          {t.bad}
        </button>
      </div>
      <CollapsibleContent className="mt-3">
        {previous ? (
          <FeedbackThankYou
            {...(previous.response?.githubUrl
              ? { githubUrl: previous.response.githubUrl }
              : {})}
            onSubmitAgain={() => {
              setOpinion(previous.opinion);
              setPrevious(null);
            }}
            t={t}
          />
        ) : (
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <textarea
              autoFocus
              className="resize-none rounded-lg border bg-fd-secondary p-3 text-fd-secondary-foreground placeholder:text-fd-muted-foreground focus-visible:outline-none"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (!e.shiftKey && e.key === "Enter") {
                  submit(e);
                }
              }}
              placeholder={t.placeholder}
              required
              value={message}
            />
            <button
              className={cn(buttonVariants({ color: "outline" }), "w-fit px-3")}
              disabled={isPending}
              type="submit"
            >
              {t.submit}
            </button>
          </form>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

export interface FeedbackTextProps {
  onSendAction: (feedback: BlockFeedback) => Promise<ActionResponse>;
  children?: ReactNode;
}

/** Block-level feedback — wrap page body; pair with `remarkBlockId`. */
export function FeedbackText({ onSendAction, children }: FeedbackTextProps) {
  const pathname = usePathname();
  const t = resolveDocsFeedbackCopy(resolveLocaleFromPathname(pathname));
  const [popup, setPopup] = useState<{
    mode: "tooltip" | "expanded";
    blockId: string;
    selection: string;
    range: Range;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { refs, floatingStyles } = useFloating({
    open: popup !== null,
    placement: "bottom",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  function expandPopup() {
    if (popup?.mode !== "tooltip") {
      return;
    }

    const highlight = new Highlight(popup.range);
    CSS.highlights.set("fd-feedback-text", highlight);

    setPopup({ ...popup, mode: "expanded" });
  }

  function closePopup() {
    if (popup?.mode === "expanded") {
      CSS.highlights.delete("fd-feedback-text");
    }

    setPopup(null);
  }

  const updateSelectionPopover = useEffectEvent(() => {
    if (popup && popup.mode === "expanded") {
      return;
    }

    const container = containerRef.current;
    const selection = window.getSelection();

    if (
      !container ||
      !selection ||
      selection.isCollapsed ||
      selection.rangeCount === 0
    ) {
      closePopup();
      return;
    }

    const range = selection.getRangeAt(0).cloneRange();
    if (!container.contains(range.commonAncestorContainer)) {
      closePopup();
      return;
    }

    const selectionText = selection.toString().trim();
    if (selectionText.length === 0 || selectionText.includes("\n")) {
      closePopup();
      return;
    }

    const element =
      range.startContainer instanceof Element
        ? range.startContainer
        : range.startContainer.parentElement;
    const blockId = element?.closest('[data-block="feedback"]')?.id;
    if (!blockId) {
      closePopup();
      return;
    }

    refs.setReference({
      getBoundingClientRect() {
        return range.getBoundingClientRect();
      },
      contextElement: container,
    });

    setPopup({
      mode: "tooltip",
      range,
      selection: selectionText,
      blockId,
    });
  });

  const closeOnEscape = useEffectEvent((event: KeyboardEvent) => {
    if (popup === null) {
      return;
    }
    if (event.key === "Escape") {
      closePopup();
    }
  });

  const closeOnPointerDown = useEffectEvent((event: PointerEvent) => {
    const target = event.target;
    if (popup === null || !(target instanceof Node)) {
      return;
    }

    if (
      refs.floating.current?.contains(target) ||
      (popup.mode === "tooltip" && containerRef.current?.contains(target))
    ) {
      return;
    }

    closePopup();
  });

  useEffect(() => {
    let frame: number | null = null;

    function scheduleSelectionPopover() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateSelectionPopover();
      });
    }

    document.addEventListener("selectionchange", scheduleSelectionPopover);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnPointerDown);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("selectionchange", scheduleSelectionPopover);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <>
      <div
        className="docs-feedback-text prose-no-margin"
        ref={containerRef}
      >
        {children}
      </div>

      {popup ? (
        <div
          className={cn(
            "not-prose z-40 h-9.5 w-30 overflow-hidden rounded-xl border bg-fd-popover text-fd-popover-foreground shadow-lg transition-[width,height] box-content text-sm",
            popup.mode === "expanded"
              ? "h-32 w-[300px] max-w-[98vw]"
              : "select-none"
          )}
          ref={refs.setFloating}
          style={floatingStyles}
        >
          {popup.mode === "tooltip" ? (
            <div className="h-9.5 w-30 p-1">
              <button
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "size-full gap-1.5"
                )}
                onClick={expandPopup}
                type="button"
              >
                <CornerDownRightIcon className="size-4 text-fd-muted-foreground" />
                {t.blockFeedbackLabel}
              </button>
            </div>
          ) : (
            <FeedbackTextForm
              blockId={popup.blockId}
              container={{
                className:
                  "p-2 h-32 w-[300px] max-w-[98vw] animate-fd-fade-in",
              }}
              onClose={closePopup}
              onSendAction={onSendAction}
              selection={popup.selection}
              t={t}
            />
          )}
        </div>
      ) : null}
    </>
  );
}

function FeedbackTextForm({
  blockId,
  selection,
  onSendAction,
  onClose,
  container,
  t,
}: {
  blockId: string;
  container: HTMLAttributes<HTMLElement>;
  onClose: () => void;
  onSendAction: (feedback: BlockFeedback) => Promise<ActionResponse>;
  selection: string;
  t: ReturnType<typeof resolveDocsFeedbackCopy>;
}) {
  const pathname = usePathname();
  const { previous, setPrevious } = useSubmissionStorage(
    `${pathname}-${blockId}`,
    (value) => {
      const result = blockFeedbackResult.safeParse(value);
      return result.success ? result.data : null;
    }
  );
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e?: SyntheticEvent) {
    startTransition(async () => {
      const feedback: BlockFeedback = {
        blockId,
        blockBody: selection,
        url: location.href,
        message,
      };

      const response = await onSendAction(feedback);
      setPrevious({
        response,
        ...feedback,
      });
      setMessage("");
    });

    e?.preventDefault();
  }

  if (previous) {
    return (
      <div
        {...container}
        className={cn(
          "flex flex-col items-center justify-center gap-2 text-center text-fd-muted-foreground",
          container.className
        )}
      >
        <FeedbackThankYou
          {...(previous.response?.githubUrl
            ? { githubUrl: previous.response.githubUrl }
            : {})}
          onSubmitAgain={() => {
            setPrevious(null);
          }}
          t={t}
        />
      </div>
    );
  }

  return (
    <form
      {...container}
      className={cn("flex flex-col gap-2", container.className)}
      onSubmit={submit}
    >
      <textarea
        autoFocus
        className="resize-none rounded-lg border bg-fd-secondary p-3 text-fd-secondary-foreground placeholder:text-fd-muted-foreground focus-visible:outline-none"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key === "Enter") {
            submit(e);
          }
        }}
        placeholder={t.placeholder}
        required
        value={message}
      />
      <div className="mt-auto grid grid-cols-2 gap-2">
        <button
          className={cn(
            buttonVariants({ variant: "primary", size: "sm" }),
            "gap-1.5"
          )}
          disabled={isPending}
          type="submit"
        >
          <CornerDownRightIcon className="size-4" />
          {t.submit}
        </button>
        <button
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "gap-1.5"
          )}
          disabled={isPending}
          onClick={onClose}
          type="button"
        >
          {t.close}
        </button>
      </div>
    </form>
  );
}

function FeedbackThankYou({
  githubUrl,
  onSubmitAgain,
  t,
}: {
  githubUrl?: string;
  onSubmitAgain: () => void;
  t: ReturnType<typeof resolveDocsFeedbackCopy>;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-fd-card px-3 py-6 text-center text-fd-muted-foreground text-sm">
      <p>{t.thankYou}</p>
      <div className="flex flex-row items-center gap-2">
        {githubUrl ? (
          <a
            className={cn(
              buttonVariants({
                color: "primary",
              }),
              "text-xs"
            )}
            href={githubUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            {t.viewOnGitHub}
          </a>
        ) : null}
        <button
          className={cn(
            buttonVariants({
              color: "secondary",
            }),
            "text-xs"
          )}
          onClick={onSubmitAgain}
          type="button"
        >
          {t.submitAgain}
        </button>
      </div>
    </div>
  );
}

function useSubmissionStorage<Result>(
  key: string,
  validate: (value: unknown) => Result | null
) {
  const storageKey = `docs-feedback-${key}`;
  const [value, setValue] = useState<Result | null>(null);
  const validateCallback = useEffectEvent(validate);

  useEffect(() => {
    const item = localStorage.getItem(storageKey);
    if (item === null) {
      return;
    }

    try {
      const validated = validateCallback(JSON.parse(item));
      if (validated !== null) {
        setValue(validated);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return {
    previous: value,
    setPrevious(result: Result | null) {
      if (result) {
        localStorage.setItem(storageKey, JSON.stringify(result));
      } else {
        localStorage.removeItem(storageKey);
      }

      setValue(result);
    },
  };
}