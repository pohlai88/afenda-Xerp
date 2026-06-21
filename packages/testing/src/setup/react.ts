/**
 * React / Next.js component test setup (jsdom).
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { installJsdomPolyfills } from "./jsdom-polyfills.js";

installJsdomPolyfills();

afterEach(() => {
  cleanup();
});
