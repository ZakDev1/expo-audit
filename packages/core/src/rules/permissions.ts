import type { ExpoHeathRule, Finding } from "../types.js";
import { PACKAGE_PERMISSION_MAP } from "./maps/permissions-map.js";

export const permissionRules: ExpoHeathRule[] = [
  {
    id: "permissions/weak-ios-permission-description",
    category: "permissions",
    description: "iOS usage descriptions should not be empty or placeholder values",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson || !ctx.appConfig) return findings;

      const deps = {
        ...(ctx.packageJson.dependencies as Record<string, string> | undefined),
        ...(ctx.packageJson.devDependencies as Record<string, string> | undefined),
      };

      const iosConfig = ctx.appConfig.ios as Record<string, unknown> | undefined;
      const infoPlist = (iosConfig?.infoPlist as Record<string, string> | undefined) ?? {};

      const placeholders = ["todo", "change me", "placeholder", "your description here"];

      for (const [pkg, mapping] of Object.entries(PACKAGE_PERMISSION_MAP)) {
        if (!(pkg in deps)) continue;

        for (const permission of mapping.ios) {
          const value = infoPlist[permission];
          if (value === undefined) continue;

          const isWeak =
            typeof value !== "string" ||
            value.trim().length === 0 ||
            placeholders.some((p) => value.toLowerCase() === p.toLowerCase());

          if (isWeak) {
            findings.push({
              ruleId: "permissions/weak-ios-permission-description",
              category: "permissions",
              severity: "warning",
              message: `${permission} is set but the description is empty or a placeholder — App Store review may reject this`,
              docs: "https://docs.expo.dev/guides/permissions/",
            });
          }
        }
      }

      return findings;
    },
  },

  {
    id: "permissions/android-permissions-opt-out",
    category: "permissions",
    description: "Setting android.permissions to an empty array disables auto-injection",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson || !ctx.appConfig) return findings;

      const deps = {
        ...(ctx.packageJson.dependencies as Record<string, string> | undefined),
        ...(ctx.packageJson.devDependencies as Record<string, string> | undefined),
      };

      const androidConfig = ctx.appConfig.android as Record<string, unknown> | undefined;
      const declaredPermissions = androidConfig?.permissions as string[] | undefined;

      if (!Array.isArray(declaredPermissions) || declaredPermissions.length > 0) return findings;

      const affectedPackages = Object.entries(PACKAGE_PERMISSION_MAP)
        .filter(([pkg, mapping]) => pkg in deps && mapping.android.length > 0)
        .map(([pkg]) => pkg);

      if (affectedPackages.length > 0) {
        findings.push({
          ruleId: "permissions/android-permissions-opt-out",
          category: "permissions",
          severity: "error",
          message: `android.permissions is set to [] which disables auto-injection. These installed packages need permissions: ${affectedPackages.join(", ")}`,
          docs: "https://docs.expo.dev/guides/permissions/#android",
        });
      }

      return findings;
    },
  },

  {
    id: "permissions/undeclared-ios-permission",
    category: "permissions",
    description: "iOS permissions declared without a corresponding installed package",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson || !ctx.appConfig) return findings;

      const deps = {
        ...(ctx.packageJson.dependencies as Record<string, string> | undefined),
        ...(ctx.packageJson.devDependencies as Record<string, string> | undefined),
      };

      const iosPermissions = ctx.appConfig.ios as Record<string, unknown> | undefined;
      const infoPlist = (iosPermissions?.infoPlist as Record<string, unknown> | undefined) ?? {};

      const permissionsToPackages: Record<string, string[]> = {};
      for (const [pkg, mapping] of Object.entries(PACKAGE_PERMISSION_MAP)) {
        for (const permission of mapping.ios) {
          permissionsToPackages[permission] ??= [];
          permissionsToPackages[permission]!.push(pkg);
        }
      }

      for (const permission of Object.keys(infoPlist)) {
        const requiringPackages = permissionsToPackages[permission];
        if (!requiringPackages) continue;

        const hasPackage = requiringPackages.some((pkg) => pkg in deps);
        if (!hasPackage) {
          findings.push({
            ruleId: "permissions/undeclared-ios-permission",
            category: "permissions",
            severity: "warning",
            message: `ios.infoPlist.${permission} is declared but no package that requires it is installed`,
            docs: "https://docs.expo.dev/guides/permissions/",
          });
        }
      }

      return findings;
    },
  },
];
