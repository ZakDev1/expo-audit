import { describe, it, expect } from 'vitest'
import { permissionRules } from './permissions.js'
import { makeContext, makeAppConfig, makePackageJson } from '../test/fixtures.js'

const rule = (id: string) => permissionRules.find(r => r.id === id)!

describe('permissions/weak-ios-permission-description', () => {
  it('passes when no permissions are declared', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig(),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/weak-ios-permission-description').run(ctx)
    expect(findings).toHaveLength(0)
  })

  it('passes when a strong description is set', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({
        ios: {
          bundleIdentifier: 'com.example.app',
          infoPlist: { NSCameraUsageDescription: 'Used to scan QR codes' }
        }
      }),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/weak-ios-permission-description').run(ctx)
    expect(findings).toHaveLength(0)
  })

  it('warns when description is empty', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({
        ios: {
          bundleIdentifier: 'com.example.app',
          infoPlist: { NSCameraUsageDescription: '' }
        }
      }),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/weak-ios-permission-description').run(ctx)
    expect(findings).toHaveLength(1)
    expect(findings[0]!.severity).toBe('warning')
  })

  it('warns when description is a placeholder', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({
        ios: {
          bundleIdentifier: 'com.example.app',
          infoPlist: { NSCameraUsageDescription: 'TODO' }
        }
      }),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/weak-ios-permission-description').run(ctx)
    expect(findings).toHaveLength(1)
  })
})

describe('permissions/android-permissions-opt-out', () => {
  it('passes when android.permissions is not set', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig(),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/android-permissions-opt-out').run(ctx)
    expect(findings).toHaveLength(0)
  })

  it('errors when android.permissions is empty and camera is installed', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({
        android: { package: 'com.example.app', permissions: [] }
      }),
      packageJson: makePackageJson({ 'expo-camera': '~14.0.0' }),
    })
    const findings = await rule('permissions/android-permissions-opt-out').run(ctx)
    expect(findings).toHaveLength(1)
    expect(findings[0]!.severity).toBe('error')
    expect(findings[0]!.message).toContain('expo-camera')
  })

  it('passes when android.permissions is empty but no permission packages installed', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({
        android: { package: 'com.example.app', permissions: [] }
      }),
      packageJson: makePackageJson(),
    })
    const findings = await rule('permissions/android-permissions-opt-out').run(ctx)
    expect(findings).toHaveLength(0)
  })
})
