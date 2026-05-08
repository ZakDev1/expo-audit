import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectContext } from "./types.js";

async function readJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function loadProjectContext(projectRoot: string): Promise<ProjectContext> {
  const [appJson, easConfig, packageJson] = await Promise.all([
    readJson(join(projectRoot, "app.json")),
    readJson(join(projectRoot, "eas.json")),
    readJson(join(projectRoot, "package.json")),
  ]);

  const appConfig = (appJson?.expo as Record<string, unknown> | null) ?? appJson;

  return {
    projectRoot,
    appConfig,
    easConfig,
    packageJson,
  };
}
