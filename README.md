# expo-audit

Static analysis for Expo projects. Validates app config, EAS build profiles, permissions, and native dependencies.

## Why

Expo projects silently accumulate misconfigurations such as missing bundle identifiers, permissions declared for uninstalled packages, EAS build profiles that will fail at submission time. These are only caught at build time or App Store review, often hours or days later.

`expo-audit` catches them in seconds.

## Installation

```bash
npm install -g expo-audit
# or
pnpm add -g expo-audit
```

Or run without installing:

```bash
npx expo-audit scan
```

## Usage

Run from the root of your Expo project:

```bash
expo-audit scan
```

Output:

```
Scanning /your/project...

CONFIG
  ✖ error    ios.bundleIdentifier is not set - required for App Store submission
             https://docs.expo.dev/versions/latest/config/app/#bundleidentifier

PERMISSIONS
  ⚠ warning  NSCameraUsageDescription is set but the description is empty or a placeholder
             https://docs.expo.dev/guides/permissions/

EAS
  ✖ error    No production build profile found in eas.json
             https://docs.expo.dev/build/eas-json/

Found 2 errors, 1 warning
```

### Flags

```bash
expo-audit scan --json              # Output as JSON (useful for CI)
expo-audit scan --rule config       # Run a single category only
expo-audit scan --rule permissions
expo-audit scan --rule dependencies
expo-audit scan --rule eas
```

### CI usage

`expo-audit` exits with code `1` if any errors are found, making it CI-friendly:

```yaml
# .github/workflows/audit.yml
- name: Run expo-audit
  run: npx expo-audit scan
```

## Rules

### Config
| Rule | Severity | Description |
||-|-|
| `config/missing-bundle-identifier` | error | `ios.bundleIdentifier` must be set |
| `config/missing-package` | error | `android.package` must be set |
| `config/missing-scheme` | warning | `scheme` must be set for deep linking and OAuth |
| `config/missing-version` | warning | `version` must be defined |

### Permissions
| Rule | Severity | Description |
||-|-|
| `permissions/weak-ios-permission-description` | warning | iOS usage descriptions should not be empty or placeholders |
| `permissions/android-permissions-opt-out` | error | Setting `android.permissions: []` disables auto-injection |

### Dependencies
| Rule | Severity | Description |
||-|-|
| `dependencies/missing-config-plugin` | error | Native modules must be listed in the plugins array |
| `dependencies/sdk-incompatible-package` | warning | Package version may be incompatible with your Expo SDK |
| `dependencies/deprecated-package` | warning | Installed package has been deprecated |

### EAS
| Rule | Severity | Description |
||-|-|
| `eas/no-eas-config` | info | No `eas.json` found |
| `eas/missing-production-profile` | error | A production build profile must be defined |
| `eas/missing-development-profile` | warning | A development build profile is recommended |
| `eas/development-client-not-set` | warning | Development profile should have `developmentClient: true` |
| `eas/missing-auto-increment` | warning | Production profile should have `autoIncrement` enabled |
| `eas/unpinned-cli-version` | info | EAS CLI version should be pinned |

## Architecture

`expo-audit` is a monorepo with two packages:

- `@expo-audit/core` — rule engine and all rule logic, framework-agnostic
- `expo-audit` — CLI built on top of core

The separation means the rule logic is never duplicated. Adding a new rule in core makes it available in the CLI automatically.

## Contributing

Contributions are welcome, especially new rules.

### Adding a rule

1. Add your rule to the appropriate file in `packages/core/src/rules/`
2. Export it and add it to `allRules` in `packages/core/src/index.ts`
3. Add tests in the corresponding `*.test.ts` file
4. Open a PR with a description of what the rule catches and why it matters

### Running locally

```bash
pnpm install
pnpm build
pnpm test
```

To test against a real Expo project:

```bash
node packages/cli/dist/index.js scan
```

## License

MIT
