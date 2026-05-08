#!/usr/bin/env node

import { resolve } from "node:path";
import { allRules, loadProjectContext } from "@expo-audit/core";
import { formatFindings, formatJson } from "./formatter.js";
import { Command } from "commander";

const program = new Command();

program.name("expo-audit").description("Health checks for Expo projects").version("0.1.0");

program
  .command("scan")
  .description("Scan your Expo project for issues")
  .option("--json", "Output results as JSON")
  .option("--rule <category>", "Only run rules for specific category")
  .action(async (options: { json?: boolean; rule?: string }) => {
    const projectRoot = resolve(process.cwd());

    if (!options.json) {
      console.log(`\nScanning ${projectRoot}...`);
    }

    const ctx = await loadProjectContext(projectRoot);

    const rulesToRun = options.rule ? allRules.filter((r) => r.category === options.rule) : allRules;

    if (rulesToRun.length === 0) {
      console.error(`No rules found for category: ${options.rule}`);
      process.exit(1);
    }

    const results = await Promise.all(rulesToRun.map((r) => r.run(ctx)));
    const findings = results.flat();

    if (options.json) {
      formatJson(findings);
    } else {
      formatFindings(findings);
    }

    const hasErrors = findings.some((f) => f.severity === "error");
    process.exit(hasErrors ? 1 : 0);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
