import type { ExpoHeathRule } from "../types.js";

type BuildProfile = {
  developmentClient?: boolean;
  distrubution?: string;
  autoIncrement?: boolean;
  channel?: string;
};

type EasConfig = {
  cli?: { version?: string };
  build?: Record<string, BuildProfile>;
  submit?: Record<string, unknown>;
};

export const easRules: ExpoHeathRule[] = [
  {
    id: "eas/no-eas-config",
    category: "eas",
    description: "No eas.json found - project is not configured for EAS builds",
    async run(ctx) {
      if (!ctx.easConfig) {
        return [
          {
            ruleId: "eas/no-eas-config",
            category: "eas",
            severity: "info",
            message: 'No eas.json found - run "eas build:configure" to setup EAS builds',
            docs: "https://docs.expo.dev/build/setup",
          },
        ];
      }
      return [];
    },
  },

  {
    id: "eas/missing-production-profile",
    category: "eas",
    description: "A production build profile must be defined",
    async run(ctx) {
      if (!ctx.easConfig) return [];

      const eas = ctx.easConfig as EasConfig;
      const profiles = eas.build ?? {};

      if (!("production" in profiles)) {
        return [
          {
            ruleId: "eas/missing-production-profile",
            category: "eas",
            severity: "error",
            message: "No production build found in eas.json - required for App Store and Play Store builds",
            docs: "https://docs.expo.dev/build/eas.json",
          },
        ];
      }
      return [];
    },
  },

  {
    id: "eas/missing-development-profile",
    category: "eas",
    description: "A development build profile is recommended for local development",
    async run(ctx) {
      if (!ctx.easConfig) return [];

      const eas = ctx.easConfig as EasConfig;
      const profiles = eas.build ?? {};

      if (!("development" in profiles)) {
        return [
          {
            ruleId: "eas/missing-development-profile",
            category: "eas",
            severity: "warning",
            message: "No development build profile found - recommended for expo-dev-client builds",
            docs: "https://docs.expo.dev/builds/eas.json",
          },
        ];
      }
      return [];
    },
  },

  {
    id: "eas/development-client-not-set",
    category: "eas",
    description: "Development profile should have developmentClient set to true",
    async run(ctx) {
      if (!ctx.easConfig) return [];

      const eas = ctx.easConfig as EasConfig;
      const devProfile = eas.build?.development;

      if (devProfile && !devProfile.developmentClient) {
        return [
          {
            ruleId: "eas/development-client-not-set",
            category: "eas",
            severity: "warning",
            message: "build.development.developmentClient is not set to true - expo-dev-client will not be used",
            docs: "https://docs.expo.dev/develop/development-builds/create-a-build",
          },
        ];
      }
      return [];
    },
  },

  {
    id: "eas/missing-auto-increment",
    category: "eas",
    description: "Production profile should have autoIncrement enabled",
    async run(ctx) {
      if (!ctx.easConfig) return [];

      const eas = ctx.easConfig as EasConfig;
      const profProfile = eas.build?.production;

      if (profProfile && !profProfile.autoIncrement) {
        return [
          {
            ruleId: "eas/missing-auto-increment",
            category: "eas",
            severity: "warning",
            message:
              "build.production.autoIncrement is not set - you will need to manually bump version numbers before each release",
            docs: "https://docs.expo.dev/build/eas-json/#autoincrement",
          },
        ];
      }
      return [];
    },
  },

  {
    id: "eas/unpinned-cli-version",
    category: "eas",
    description: "EAS CLI version should be pinned to avoid unexpected buld changes",
    async run(ctx) {
      if (!ctx.easConfig) return [];

      const eas = ctx.easConfig as EasConfig;

      if (!eas.cli?.version) {
        return [
          {
            ruleId: "eas/unpinned-cli-version",
            category: "eas",
            severity: "info",
            message: "cli.version is not set in eas.json - pinning the CLI version ensures consistent builds",
            docs: "https://docs.expo.dev/build/eas-json/#cli",
          },
        ];
      }
      return [];
    },
  },
];
