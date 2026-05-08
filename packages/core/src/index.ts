import { dependencyRules } from "./rules/dependencies.js";
import { configRules } from "./rules/config.js";
import { permissionRules } from "./rules/permissions.js";
import { easRules } from "./rules/eas.js";

export type { ExpoHeathRule, Finding, ProjectContext, Severity, Category } from "./types.js";
export { loadProjectContext } from "./context.js";
export { configRules } from "./rules/config.js";
export { permissionRules } from "./rules/permissions.js";
export { dependencyRules } from "./rules/dependencies.js";
export { easRules } from "./rules/eas.js";

export const allRules = [...configRules, ...permissionRules, ...dependencyRules, ...easRules];
