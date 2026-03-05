/// <reference types="chrome" />
import type { RedirectRule } from '../shared/types'
import { storageService } from '../shared/utils/storage'
import { mapRulesToChromeRules } from '../shared/utils/ruleMapper'

const LOG = '[URL Redirector]'

async function syncDynamicRules(rules: RedirectRule[]): Promise<void> {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = existing.map((r) => r.id)
    const addRules = mapRulesToChromeRules(rules)

    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules })

    console.log(LOG, 'Synced', addRules.length, 'active rule(s) of', rules.length, 'total')
  } catch (err) {
    console.error(LOG, 'Failed to sync rules:', err)
  }
}

// ── Lifecycle ───────────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  console.log(LOG, 'onInstalled:', reason)
  const rules = await storageService.getRules()
  await syncDynamicRules(rules)
})

// ── Storage listener ─────────────────────────────────────────────
storageService.onRulesChanged((rules) => {
  void syncDynamicRules(rules)
})

// ── Message handler ──────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message: { type: string }, _sender, sendResponse) => {
  if (message.type === 'GET_ACTIVE_RULES_COUNT') {
    chrome.declarativeNetRequest
      .getDynamicRules()
      .then((rules) => {
        sendResponse({ count: rules.length })
      })
      .catch(() => {
        sendResponse({ count: 0 })
      })
    return true // keep message channel open
  }
  return false
})
