export interface PermissionMapping {
  ios: string[];
  android: string[];
  autoInjected: boolean;
}

export const PACKAGE_PERMISSION_MAP: Record<string, PermissionMapping> = {
  "expo-camera": {
    ios: ["NSCameraUsageDescription"],
    android: ["android.permission.CAMERA"],
    autoInjected: true,
  },
  "expo-media-library": {
    ios: ["NSPhotoLibraryUsageDescription", "NSPhotoLibraryAddUsageDescription"],
    android: ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE"],
    autoInjected: true,
  },
  "expo-location": {
    ios: ["NSLocationWhenInUseUsageDescription"],
    android: ["android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION"],
    autoInjected: true,
  },
  "expo-contacts": {
    ios: ["NSContactsUsageDescription"],
    android: ["android.permission.READ_CONTACTS"],
    autoInjected: true,
  },
  "expo-calendar": {
    ios: ["NSCalendarsUsageDescription", "NSRemindersUsageDescription"],
    android: ["android.permission.READ_CALENDAR", "android.permission.WRITE_CALENDAR"],
    autoInjected: true,
  },
  "expo-microphone": {
    ios: ["NSMicrophoneUsageDescription"],
    android: ["android.permission.RECORD_AUDIO"],
    autoInjected: true,
  },
  "expo-notifications": {
    ios: [],
    android: ["android.permission.RECEIVE_BOOT_COMPLETED", "android.permission.VIBRATE"],
    autoInjected: true,
  },
  "expo-local-authentication": {
    ios: ["NSFaceIDUsageDescription"],
    android: ["android.permission.USE_BIOMETRIC", "android.permission.USE_FINGERPRINT"],
    autoInjected: true,
  },
  "expo-sensors": {
    ios: ["NSMotionUsageDescription"],
    android: [],
    autoInjected: true,
  },
  "expo-bluetooth": {
    ios: ["NSBluetoothAlwaysUsageDescription", "NSBluetoothPeripheralUsageDescription"],
    android: ["android.permission.BLUETOOTH", "android.permission.BLUETOOTH_ADMIN"],
    autoInjected: false,
  },
};
