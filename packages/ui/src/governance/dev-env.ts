/** Shared development-mode gate for governance runtime assertions. */
export const isDevelopment = process.env["NODE_ENV"] !== "production";
