import React from "react";
import { useState } from "react";

import { MetadataActionBar } from "../client/metadata-action-renderer.client.js";
import { interactiveActionFixtures } from "./metadata-action-bar-story.fixtures.js";

export function InteractiveActionBarDemo() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div>
      <MetadataActionBar
        actions={interactiveActionFixtures}
        onAction={async (action) => ({
          ok: true,
          actionKey: action.key,
          message: `Handled ${action.key}`,
        })}
        onActionResult={(result) => {
          if (result.ok) {
            setLastAction(result.actionKey);
          }
        }}
      />
      <p className="metadata-wrap-anywhere">Last action: {lastAction}</p>
    </div>
  );
}
