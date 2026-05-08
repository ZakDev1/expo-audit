import type { ProjectContext } from "../types.js";

export function makeContext(overrides: Partial<ProjectContext> = {}): ProjectContext {
  return {
    projectRoot: "/fake/project",
    appConfig: null,
    easConfig: null,
    packageJson: null,
    ...overrides,
  };
}

export function makeAppConfig(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const { ios, android, ...rest } = overrides;

  return {
    name: "my-app",
    slug: "my-app",
    version: "1.0.0",
    scheme: "myapp",
    ...rest,
    ios: ios !== undefined ? ios : { bundleIdentifier: "com.example.myapp" },
    android: android !== undefined ? android : { package: "com.example.myapp" },
  };
}

export function makePackageJson(deps: Record<string, string> = {}): Record<string, unknown> {
  return {
    name: "my-app",
    version: "1.0.0",
    dependencies: {
      expo: "~51.0.0",
      ...deps,
    },
  };
}

export function makeEasConfig(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    cli: {
      version: ">= 5.0.0",
    },
    build: {
      development: {
        developmentClient: true,
        distribution: "internal",
      },
      preview: {
        distribution: "internal",
      },
      production: {
        autoIncrement: true,
      },
    },
    ...overrides,
  };
}
