/** Dot-separated module path — runtime metadata scope, not a database entity. */
export type SurfaceId = string;

export interface SurfaceContext {
  readonly surfaceId: SurfaceId;
}
