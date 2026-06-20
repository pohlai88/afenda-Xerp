export interface WorkspacePackageJson {
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
  readonly name: string;
  readonly peerDependencies?: Readonly<Record<string, string>>;
}

export interface DiscoveredWorkspace {
  readonly directoryName: string;
  readonly packageJson: WorkspacePackageJson;
  readonly packageJsonPath: string;
  readonly root: string;
}
