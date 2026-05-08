export interface PluginRequirement {
  /** The string that must appear in the plugins array */
  plugin: string
}

export interface CompatRequirement {
  /** Minimum expo SDK major version required for this package version */
  minExpoSdk: number
  /** Minimum package major version compatible with the expo SDK */
  minPackageVersion: number
}

export interface DeprecatedPackage {
  /** The package that replaces this one */
  replacement: string
  /** SDK version it was deprecated in */
  deprecatedInSdk: number
  message: string
}

export const PLUGIN_REQUIREMENTS: Record<string, PluginRequirement> = {
  'expo-camera': { plugin: 'expo-camera' },
  'expo-location': { plugin: 'expo-location' },
  'expo-notifications': { plugin: 'expo-notifications' },
  'expo-local-authentication': { plugin: 'expo-local-authentication' },
  'expo-media-library': { plugin: 'expo-media-library' },
  'expo-sensors': { plugin: 'expo-sensors' },
  'expo-calendar': { plugin: 'expo-calendar' },
  'expo-contacts': { plugin: 'expo-contacts' },
  'expo-av': { plugin: 'expo-av' },
  'expo-background-fetch': { plugin: 'expo-background-fetch' },
  'expo-task-manager': { plugin: 'expo-task-manager' },
}

export const COMPAT_REQUIREMENTS: Record<string, CompatRequirement> = {
  'expo-camera': { minExpoSdk: 50, minPackageVersion: 14 },
  'expo-router': { minExpoSdk: 49, minPackageVersion: 2 },
  'expo-location': { minExpoSdk: 49, minPackageVersion: 16 },
  'expo-av': { minExpoSdk: 49, minPackageVersion: 13 },
  'expo-media-library': { minExpoSdk: 49, minPackageVersion: 15 },
  'expo-notifications': { minExpoSdk: 50, minPackageVersion: 0 },
}

export const DEPRECATED_PACKAGES: Record<string, DeprecatedPackage> = {
  '@expo/vector-icons': {
    replacement: 'expo-symbols or @expo-google-fonts',
    deprecatedInSdk: 50,
    message: '@expo/vector-icons is deprecated — consider migrating to expo-symbols for native icons',
  },
  'expo-app-loading': {
    replacement: 'expo-splash-screen',
    deprecatedInSdk: 46,
    message: 'expo-app-loading is deprecated — migrate to expo-splash-screen',
  },
  'expo-firebase-analytics': {
    replacement: '@react-native-firebase/analytics',
    deprecatedInSdk: 46,
    message: 'expo-firebase-analytics is deprecated — migrate to @react-native-firebase/analytics',
  },
  'expo-firebase-recaptcha': {
    replacement: '@firebase/auth',
    deprecatedInSdk: 49,
    message: 'expo-firebase-recaptcha is deprecated — migrate to @firebase/auth',
  },
}
