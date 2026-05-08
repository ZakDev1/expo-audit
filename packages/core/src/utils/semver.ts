/**
 * Strips range of prefixes and returns a clean version string
 * e.g. "~11.0.1" -> "11.0.1", "^12.0.0" -> "12.0.0"
 */
export function stripRange(version: string): string {
  return version.replace(/^[\^~>=<]+/, "").trim();
}

/**
 * Returns the major version as a number
 * e.g. "16.0.0" -> 16
 */
export function majorVersion(version: string): number {
  return parseInt(stripRange(version).split(".")[0] ?? "0", 10);
}

/**
 * Returns true if the installed version satisfies the minimum checks
 * Works on major version only - sufficient for SDK compat checks
 */
export function satisfiesMinimum(installed: string, minimum: string): boolean {
  return majorVersion(installed) >= majorVersion(minimum);
}
