import { describe, it, expect } from 'vitest'
import { configRules } from './config.js'
import { makeContext, makeAppConfig } from '../test/fixtures.js'

const rule = (id: string) => configRules.find(r => r.id === id)!

describe('config/missing-bundle-identifier', () => {
  it('passes when bundleIdentifier is set', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig()
    })
    const findings = await rule('config/missing-bundle-identifier').run(ctx)
    expect(findings).toHaveLength(0)
  })

  it('errors when bundleIdentifier is missing', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({ ios: {} })
    })
    const findings = await rule('config/missing-bundle-identifier').run(ctx)
    expect(findings).toHaveLength(1)
    expect(findings[0]!.severity).toBe('error')
  })

  it('errors when appConfig is null', async () => {
    const ctx = makeContext({ appConfig: null })
    const findings = await rule('config/missing-bundle-identifier').run(ctx)
    expect(findings).toHaveLength(1)
  })
})

describe('config/missing-scheme', () => {
  it('passes when scheme is set', async () => {
    const ctx = makeContext({ appConfig: makeAppConfig() })
    const findings = await rule('config/missing-scheme').run(ctx)
    expect(findings).toHaveLength(0)
  })

  it('warns when scheme is missing', async () => {
    const ctx = makeContext({
      appConfig: makeAppConfig({ scheme: undefined })
    })
    const findings = await rule('config/missing-scheme').run(ctx)
    expect(findings).toHaveLength(1)
    expect(findings[0]!.severity).toBe('warning')
  })
})
