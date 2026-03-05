import { describe, it, expect } from 'vitest'
import { validateRule } from '../../shared/utils/validators'
import type { ResourceType } from '../../shared/types'

const VALID_BASE = {
  name: 'My Rule',
  sourcePattern: 'https://example.com/app.js',
  targetUrl: 'http://localhost:3000/app.js',
  isRegex: false,
  isEnabled: true,
  resourceTypes: ['script'] as ResourceType[],
}

describe('validateRule', () => {
  it('returns valid for a correct URL rule', () => {
    const result = validateRule(VALID_BASE)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('requires name', () => {
    const result = validateRule({ ...VALID_BASE, name: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBeDefined()
  })

  it('enforces name length limit', () => {
    const result = validateRule({ ...VALID_BASE, name: 'a'.repeat(101) })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBeDefined()
  })

  it('requires source pattern', () => {
    const result = validateRule({ ...VALID_BASE, sourcePattern: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.sourcePattern).toBeDefined()
  })

  it('validates regex syntax', () => {
    const result = validateRule({ ...VALID_BASE, isRegex: true, sourcePattern: '[invalid(' })
    expect(result.isValid).toBe(false)
    expect(result.errors.sourcePattern).toMatch(/invalid/i)
  })

  it('accepts valid regex pattern', () => {
    const result = validateRule({
      ...VALID_BASE,
      isRegex: true,
      sourcePattern: 'https://example\\\\.com/(.*)',
      targetUrl: 'http://localhost:3000/$1',
    })
    expect(result.isValid).toBe(true)
  })

  it('requires target URL', () => {
    const result = validateRule({ ...VALID_BASE, targetUrl: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.targetUrl).toBeDefined()
  })

  it('rejects invalid target URL', () => {
    const result = validateRule({ ...VALID_BASE, targetUrl: 'not-a-url' })
    expect(result.isValid).toBe(false)
    expect(result.errors.targetUrl).toBeDefined()
  })

  it('requires at least one resource type', () => {
    const result = validateRule({ ...VALID_BASE, resourceTypes: [] })
    expect(result.isValid).toBe(false)
    expect(result.errors.resourceTypes).toBeDefined()
  })
})
