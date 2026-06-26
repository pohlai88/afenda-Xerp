import { test as base } from "@playwright/test";

/**
 * Shared Playwright fixtures for Afenda E2E suites.
 * Extend here for cross-app fixtures — do not duplicate in app e2e folders.
 */
export const test = base.extend({});

export type AfendaE2EFixtures = typeof test;
