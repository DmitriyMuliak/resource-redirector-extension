import type { RedirectRule } from '../types'

type DNRRule = chrome.declarativeNetRequest.Rule
type DNRResourceType = chrome.declarativeNetRequest.ResourceType

/**
 * Generates a stable numeric ID for chrome.declarativeNetRequest from a UUID string.
 * This is necessary because Chrome requires integer IDs (1 to 2147483647).
 */
function getNumericId(uuid: string): number {
  let hash = 0
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  // Ensure positive integer and within safe range for Chrome
  return (Math.abs(hash) % 2147483646) + 1
}

export function mapToChromeRule(rule: RedirectRule): DNRRule {
  const numericId = getNumericId(rule.id)
  const resourceTypes = rule.resourceTypes as DNRResourceType[]

  if (rule.isRegex) {
    return {
      id: numericId,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
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
      type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
      redirect: { url: rule.targetUrl },
    },
    condition: {
      urlFilter: rule.sourcePattern,
      resourceTypes,
    },
  }
}

export function mapRulesToChromeRules(rules: RedirectRule[]): DNRRule[] {
  return rules
    .filter((r) => r.isEnabled)
    .map((r) => mapToChromeRule(r))
}
