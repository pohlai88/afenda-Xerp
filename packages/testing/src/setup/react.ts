/**
 * React / Next.js component test setup (jsdom).
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

afterEach(() => {
  cleanup();
});
