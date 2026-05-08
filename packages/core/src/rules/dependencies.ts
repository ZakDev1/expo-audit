import type { ExpoHeathRule, Finding } from "../types.js";
import { majorVersion, satisfiesMinimum } from "../utils/semver.js";
import { PLUGIN_REQUIREMENTS, COMPAT_REQUIREMENTS, DEPRECATED_PACKAGES } from "./maps/dependencies-map.js";

export const dependencyRules: ExpoHeathRule[] = [
  {
    id: "dependencies/missing-config-plugin",
    category: "dependencies",
    description: "Native modules must be listed in the plugins array in app.json",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson || !ctx.appConfig) return findings;

      const deps = {
        ...(ctx.packageJson.dependencies as Record<string, string> | undefined),
        ...(ctx.packageJson.devDependencies as Record<string, string> | undefined),
      };

      const plugins = (ctx.appConfig.plugins as unknown[] | undefined) ?? [];

      const registeredPlugins = new Set(plugins.map((p) => (Array.isArray(p) ? p[0] : p) as string));

      for (const [pkg, { plugin }] of Object.entries(PLUGIN_REQUIREMENTS)) {
        if (!(pkg in deps)) continue;
        if (!registeredPlugins.has(plugin)) {
          findings.push({
            ruleId: "dependencies/missing-config-plugin",
            category: "dependencies",
            severity: "error",
            message: `${pkg} is installed but "${plugin}" is not in the plugins array — native functionality will not work`,
            docs: "https://docs.expo.dev/config-plugins/introduction/",
          });
        }
      }

      return findings;
    },
  },

  {
    id: "dependencies/sdk-incompatible-package",
    category: "dependencies",
    description: "Installed package version may be incompatible with your Expo SDK version",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson) return findings;

      const deps = (ctx.packageJson.dependencies as Record<string, string> | undefined) ?? {};
      const expoVersion = deps["expo"];

      if (!expoVersion) return findings;

      const installedSdk = majorVersion(expoVersion);

      for (const [pkg, compat] of Object.entries(COMPAT_REQUIREMENTS)) {
        const pkgVersion = deps[pkg];
        if (!pkgVersion) continue;

        const isExpoTooOld = installedSdk < compat.minExpoSdk;
        const isPkgTooOld = !satisfiesMinimum(pkgVersion, `${compat.minPackageVersion}.0.0`);

        if (isExpoTooOld || isPkgTooOld) {
          findings.push({
            ruleId: "dependencies/sdk-incompatible-package",
            category: "dependencies",
            severity: "warning",
            message: `${pkg}@${pkgVersion} may be incompatible with expo@${expoVersion} — expected expo>=${compat.minExpoSdk} and ${pkg}>=${compat.minPackageVersion}`,
            docs: "https://docs.expo.dev/versions/latest/",
          });
        }
      }

      return findings;
    },
  },

  {
    id: "dependencies/deprecated-package",
    category: "dependencies",
    description: "Installed package has been deprecated and should be replaced",
    async run(ctx) {
      const findings: Finding[] = [];

      if (!ctx.packageJson) return findings;

      const deps = {
        ...(ctx.packageJson.dependencies as Record<string, string> | undefined),
        ...(ctx.packageJson.devDependencies as Record<string, string> | undefined),
      };

      for (const [pkg, info] of Object.entries(DEPRECATED_PACKAGES)) {
        if (!(pkg in deps)) continue;
        findings.push({
          ruleId: "dependencies/deprecated-package",
          category: "dependencies",
          severity: "warning",
          message: `${info.message} — replace with ${info.replacement}`,
          docs: "https://docs.expo.dev/versions/latest/",
        });
      }

      return findings;
    },
  },
];
