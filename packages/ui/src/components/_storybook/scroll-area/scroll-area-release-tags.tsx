import type { ReactNode } from "react";
import { ScrollArea } from "../../scroll-area";
import {
  SCROLL_AREA_RELEASE_TAGS,
  SCROLL_AREA_RELEASE_TITLE,
} from "./scroll-area-fixtures";

/** Compact release-tag scroller — ERP variant of scroll-area-01 list pattern. */
export function StorybookScrollAreaReleaseTags(): ReactNode {
  return (
    <div className="afenda-storybook-scroll-area afenda-storybook-scroll-area--wide">
      <ScrollArea>
        <div className="afenda-storybook-scroll-area__content">
          <h4 className="afenda-storybook-scroll-area__title">
            {SCROLL_AREA_RELEASE_TITLE}
          </h4>
          <ul className="afenda-storybook-scroll-area__tag-list">
            {SCROLL_AREA_RELEASE_TAGS.map((tag) => (
              <li className="afenda-storybook-scroll-area__tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
}
