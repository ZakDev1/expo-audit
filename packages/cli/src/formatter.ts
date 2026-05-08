import type { Finding, Severity } from "@expo-audit/core";

const ICONS: Record<Severity, string> = {
  error: "✖",
  warning: "⚠",
  info: "ℹ",
};

const COLORS: Record<Severity, string> = {
  error: "\x1b[31m", // red
  warning: "\x1b[33m", // yellow
  info: "\x1b[36m", // cyan
};

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function colorize(severity: Severity, text: string): string {
  return `${COLORS[severity]}${text}${RESET}`;
}

export function formatFindings(findings: Finding[]): void {
  if (findings.length === 0) {
    console.log(`\n${COLORS.info}✔ No issues found${RESET}\n`);
    return;
  }

  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const infos = findings.filter((f) => f.severity === "info");

  const grouped = findings.reduce<Record<string, Finding[]>>((acc, f) => {
    acc[f.category] ??= [];
    acc[f.category]!.push(f);
    return acc;
  }, {});

  console.log("");

  for (const [category, categoryFindings] of Object.entries(grouped)) {
    console.log(`${BOLD}${category.toUpperCase()}${RESET}`);

    for (const finding of categoryFindings) {
      const icon = ICONS[finding.severity];
      const label = colorize(finding.severity, `${icon} ${finding.severity}`);
      console.log(`  ${label}  ${finding.message}`);
      if (finding.docs) {
        console.log(`         ${DIM}${finding.docs}${RESET}`);
      }
    }

    console.log("");
  }

  const parts: string[] = [];
  if (errors.length) parts.push(colorize("error", `${errors.length} error${errors.length > 1 ? "s" : ""}`));
  if (warnings.length) parts.push(colorize("warning", `${warnings.length} warning${warnings.length > 1 ? "s" : ""}`));
  if (infos.length) parts.push(colorize("info", `${infos.length} info`));

  console.log(`Found ${parts.join(", ")}\n`);
}

export function formatJson(findings: Finding[]): void {
  console.log(JSON.stringify(findings, null, 2));
}
