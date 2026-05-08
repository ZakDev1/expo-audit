import { describe, it, expect } from "vitest";
import { easRules } from "./eas.js";
import { makeContext, makeAppConfig, makePackageJson, makeEasConfig } from "../test/fixtures.js";
import { findSourceMap } from "module";

const rule = (id: string) => easRules.find((r) => r.id === id)!;

describe("eas/no-eas-config", () => {
  it("passes when eas config if present", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig(),
    });
    const findings = await rule("eas/no-eas-config").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("fires info severity when config is missing", async () => {
    const ctx = makeContext({});
    const findings = await rule("eas/no-eas-config").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("info");
  });
});

describe("eas/missing-production-profile", () => {
  it("passes when production build profile is defined", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig(),
    });
    const findings = await rule("eas/missing-production-profile").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("errors when production build profile is missing", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        build: {
          preview: {
            distribution: "internal",
          },
        },
      }),
    });
    const findings = await rule("eas/missing-production-profile").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("error");
  });
});

describe("eas/missing-development-profile", () => {
  it("passes when development build profile is defined", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig(),
    });
    const findings = await rule("eas/missing-development-profile").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("warns when development build profile is missing", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        build: {
          preview: {
            distribution: "internal",
          },
          production: {
            autoIncrement: true,
          },
        },
      }),
    });
    const findings = await rule("eas/missing-development-profile").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("warning");
  });
});

describe("eas/development-client-not-set", () => {
  it("passes when developmentClient is set to true", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig(),
    });
    const findings = await rule("eas/development-client-not-set").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("warns when developmentClient is set to false", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        build: {
          development: {
            developmentClient: false,
            distribution: "internal",
          },
        },
      }),
    });
    const findings = await rule("eas/development-client-not-set").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("warning");
  });

  it("does not fire when development profile is absent", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        build: {
          production: { autoIncrement: true },
        },
      }),
    })
    const findings = await rule("eas/development-client-not-set").run(ctx)
    expect(findings).toHaveLength(0)
  })
});

describe("eas/missing-auto-increment", () => {
  it("passes when autoIncrement is set to true", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig(),
    });
    const findings = await rule("eas/missing-auto-increment").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("warns when autoIncrement is set to false", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        build: {
          production: {
            autoIncrement: false,
          },
        },
      }),
    });
    const findings = await rule("eas/missing-auto-increment").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("warning");
  });
});

describe("eas/unpinned-cli-version", () => {
  it("passes when CLI version is pinned", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        cli: {
          version: ">= 5.0.0",
        },
      }),
    });
    const findings = await rule("eas/unpinned-cli-version").run(ctx);
    expect(findings).toHaveLength(0);
  });

  it("fires info if cli is unpinned", async () => {
    const ctx = makeContext({
      easConfig: makeEasConfig({
        cli: {},
      }),
    });
    const findings = await rule("eas/unpinned-cli-version").run(ctx);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe("info");
  });
});
