import { describe, it, expect } from "vitest"
import { mapToChromeRule, mapRulesToChromeRules } from "../../shared/utils/ruleMapper"
import type { RedirectRule } from "../../shared/types"

const makeRule = (overrides: Partial<RedirectRule> = {}): RedirectRule => ({
  id: "abc-123",
  name: "Test Rule",
  sourcePattern: "https://cdn.example.com/app.js",
  targetUrl: "http://localhost:3000/app.js",
  isRegex: false,
  isEnabled: true,
  resourceTypes: ["script", "xmlhttprequest"],
  createdAt: 0,
  updatedAt: 0,
  ...overrides,
})

describe("mapToChromeRule", () => {
  it("creates a URL filter rule", () => {
    const rule = makeRule()
    const chrome = mapToChromeRule(rule)
    expect(typeof chrome.id).toBe('number')
    expect(chrome.id).toBeGreaterThan(0)
    expect(chrome.action.type).toBe("redirect")
    expect(chrome.condition.urlFilter).toBe("https://cdn.example.com/app.js")
  })
})

describe("mapRulesToChromeRules", () => {
  it("excludes disabled rules", () => {
    const rules = [makeRule({ isEnabled: true }), makeRule({ isEnabled: false })]
    expect(mapRulesToChromeRules(rules)).toHaveLength(1)
  })
})
