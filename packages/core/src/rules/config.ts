import { ExpoHeathRule, Finding } from "../types.js";

export const configRules: ExpoHeathRule[] = [
  {
    id: "config/missing-bundle-identifier",
    category: "config",
    description: "iOS bundlerIdentifier must be set for App Store builds",
    async run(ctx) {
      if (!ctx.appConfig) {
        return [{
          ruleId: 'config/missing-bundle-identifier',
          category: 'config',
          severity: 'error',
          message: 'No app config found — create an app.json or app.config.js',
          docs: 'https://docs.expo.dev/versions/latest/config/app/',
        }]
      }

      const ios = ctx.appConfig.ios as Record<string, unknown> | undefined
      if (!ios?.bundleIdentifier) {
        return [{
          ruleId: 'config/missing-bundle-identifier',
          category: 'config',
          severity: 'error',
          message: 'ios.bundleIdentifier is not set — required for App Store submission',
          docs: 'https://docs.expo.dev/versions/latest/config/app/#bundleidentifier',
        }]
      }

      return []
    },
  },

  {
    id: "config/missing-package",
    category: "config",
    description: "Android package name must be set for Play Store builds",
    async run(ctx) {
      const findings: Finding[] = [];
      const android = ctx.appConfig?.android as Record<string, unknown> | undefined;

      if (!android?.package) {
        findings.push({
          ruleId: "config/missing-package",
          category: "config",
          severity: "error",
          message: "android.package is not set - required for Play Store submission",
          docs: "https://docs.expo.dev/versions/latest/config/app/#package",
        });
      }
      return findings;
    },
  },

  {
    id: "config/missing-scheme",
    category: "config",
    description: "scheme must be set for deep linking and OAuth flows",
    async run(ctx) {
      if (!ctx.appConfig?.scheme) {
        return [
          {
            ruleId: "config/missing-scheme",
            category: "config",
            severity: "warning",
            message: "scheme is not set - deep linking and OAuth will not work",
            docs: "https://docs.expo.dev/guides/linking",
          },
        ];
      }

      return [];
    },
  },

  {
    id: "config/missing-version",
    category: "config",
    description: "version must be defined in app config",
    async run(ctx) {
      if (!ctx.appConfig?.version) {
        return [
          {
            ruleId: "config/missing-version",
            category: "config",
            severity: "warning",
            message: "version is not set in app config",
            docs: "https://docs.expo.dev/versions/latest/config/app/#version",
          },
        ];
      }
      return [];
    },
  },
];
