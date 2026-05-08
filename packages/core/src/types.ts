export type Severity = "error" | "warning" | "info";

export type Category = "config" | "permissions" | "dependencies" | "eas";

export interface Finding {
  ruleId: string;
  category: Category;
  severity: Severity;
  message: string;
  docs?: string;
  fix?: () => Promise<void>;
}

export interface ProjectContext {
  projectRoot: string;
  appConfig: Record<string, unknown> | null;
  easConfig: Record<string, unknown> | null;
  packageJson: Record<string, unknown> | null;
}

export interface ExpoHeathRule {
  id: string;
  category: Category;
  description: string;
  run: (ctx: ProjectContext) => Promise<Finding[]>;
}
