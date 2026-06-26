/** OpenRouter configuration for docs Ask AI (`/api/chat`). */
export function resolveDocsOpenRouterApiKey(): string | undefined {
  const value = process.env["OPENROUTER_API_KEY"]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function resolveDocsOpenRouterModel(): string {
  return process.env["OPENROUTER_MODEL"]?.trim() ?? "anthropic/claude-3.5-sonnet";
}

export function isDocsAskAiConfigured(): boolean {
  return resolveDocsOpenRouterApiKey() !== undefined;
}
