import { describe, it, expect } from "vitest";
import { dependencyRules } from "./dependencies.js";
import { makeContext, makeAppConfig, makePackageJson } from "../test/fixtures.js";
import { stripRange, majorVersion } from "../utils/semver.js";

const rule = (id: string) => dependencyRules.find((r) => r.id === id)!;

describe("dependencies/missing-config-plugin", () => {
  it("passes when native module is in plugins array", async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({ plugins: ["expo-camera"] }),
      packageJson: makePackageJson({ "expo-camera": "~14.0.0" }),
    });
    const findings = await rule("dependencies/missing-config-plugin").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("errors when native module is installed but missing from plugins", async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({ plugins: [] }),
      packageJson: makePackageJson({ "expo-camera": "~14.0.0" }),
    });
    const findings = await rule("dependencies/missing-config-plugin").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("error");
    expect(findings[0]!.message).toContain("expo-camera");
  });

  it("passes when plugin is registered as a tuple with options", async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({ plugins: [["expo-camera", { cameraPermission: "Allow camera" }]] }),
      packageJson: makePackageJson({ "expo-camera": "~14.0.0" }),
    });
    const findings = await rule("dependencies/missing-config-plugin").run(ctx);
    expect(findings).toHaveLength(0);
  });
});

describe("dependencies/sdk-incompatible-package", () => {
  it("passes when package version is compatible with Expo SDK", async () => {
    const ctx = makeContext({
      packageJson: makePackageJson({ "expo-camera": "~14.0.0" }),
    });
    console.log(stripRange("~14.0.0")); // should be "14.0.0"
    console.log("mv", majorVersion("~14.0.0")); // should be 14
    const findings = await rule("dependencies/sdk-incompatible-package").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("warns when package version is too old for the SDK", async () => {
    const ctx = makeContext({
      packageJson: makePackageJson({ "expo-camera": "~12.0.0" }),
    });
    const findings = await rule("dependencies/sdk-incompatible-package").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("warning");
  });

  it("passes when no expo version is present", async () => {
    const ctx = makeContext({
      packageJson: { name: "my-app", dependencies: { "expo-camera": "~14.0.0" } },
    });
    const findings = await rule("dependencies/sdk-incompatible-package").run(ctx);
    expect(findings).toHaveLength(0);
  });
});

describe("dependencies/deprecated-package", () => {
  it("passes when no deprecated packages are installed", async () => {
    const ctx = makeContext({
      packageJson: makePackageJson(),
    });
    const findings = await rule("dependencies/deprecated-package").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("warns when a deprecated package is installed", async () => {
    const ctx = makeContext({
      packageJson: makePackageJson({ "expo-app-loading": "~2.0.0" }),
    });
    const findings = await rule("dependencies/deprecated-package").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("warning");
    expect(findings[0]!.message).toContain("expo-splash-screen");
  });
});
