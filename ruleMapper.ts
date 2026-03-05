import type { RedirectRule } from '../types'

type DNRRule = chrome.declarativeNetRequest.Rule
type DNRResourceType = chrome.declarativeNetRequest.ResourceType

export function mapToChromeRule(rule: RedirectRule, numericId: number): DNRRule {
  const resourceTypes = rule.resourceTypes as DNRResourceType[]

  if (rule.isRegex) {
    return {
      id: numericId,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { regexSubstitution: rule.targetUrl },
      },
      condition: {
        regexFilter: rule.sourcePattern,
        isUrlFilterCaseSensitive: false,
        resourceTypes,
      },
    }
  }

  return {
    id: numericId,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { url: rule.targetUrl },
    },
    condition: {
      urlFilter: rule.sourcePattern,
      resourceTypes,
    },
  }
}

export function mapRulesToChromeRules(rules: RedirectRule[]): DNRRule[] {
  return rules.filter((r) => r.isEnabled).map((r, idx) => mapToChromeRule(r, idx + 1))
}
