import { describe, it, expect } from 'vitest'
import { mapToChromeRule, mapRulesToChromeRules } from '../../shared/utils/ruleMapper'
import type { RedirectRule } from '../../shared/types'

const makeRule = (overrides: Partial<RedirectRule> = {}): RedirectRule => ({
  id: 'abc-123',
  name: 'Test Rule',
  sourcePattern: 'https://cdn.example.com/app.js',
  targetUrl: 'http://localhost:3000/app.js',
  isRegex: false,
  isEnabled: true,
  resourceTypes: ['script', 'xmlhttprequest'],
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
})

describe('mapToChromeRule', () => {
  it('creates a URL filter rule', () => {
    const rule = makeRule()
    const chrome = mapToChromeRule(rule, 42)

    expect(chrome.id).toBe(42)
    expect(chrome.priority).toBe(1)
    expect(chrome.action.type).toBe('redirect')
    expect(chrome.condition.urlFilter).toBe('https://cdn.example.com/app.js')
    expect(chrome.condition.regexFilter).toBeUndefined()
  })

  it('creates a regex rule', () => {
    const rule = makeRule({
      isRegex: true,
      sourcePattern: 'https://cdn\\.example\\.com/(.*)',
      targetUrl: 'http://localhost:3000/$1',
    })
    const chrome = mapToChromeRule(rule, 1)

    expect(chrome.condition.regexFilter).toBeDefined()
    expect(chrome.condition.urlFilter).toBeUndefined()
    expect(chrome.action.redirect?.regexSubstitution).toBe('http://localhost:3000/$1')
  })
})

describe('mapRulesToChromeRules', () => {
  it('excludes disabled rules', () => {
    const rules = [makeRule({ isEnabled: true }), makeRule({ isEnabled: false })]
    expect(mapRulesToChromeRules(rules)).toHaveLength(1)
  })

  it('assigns sequential numeric IDs starting at 1', () => {
    const rules = [makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]
    const result = mapRulesToChromeRules(rules)
    expect(result.map((r) => r.id)).toEqual([1, 2, 3])
  })

  it('returns empty array when no enabled rules', () => {
    expect(mapRulesToChromeRules([])).toEqual([])
  })
})
