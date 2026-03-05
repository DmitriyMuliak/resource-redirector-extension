/// <reference types="chrome" />
import type { RedirectRule } from '../shared/types'
import { storageService } from '../shared/utils/storage'
import { mapRulesToChromeRules } from '../shared/utils/ruleMapper'

const LOG = '[URL Redirector]'

function updateBadge(count: number): void {
  const text = count > 0 ? count.toString() : ''
  void chrome.action.setBadgeText({ text })
  void chrome.action.setBadgeBackgroundColor({ color: '#4F46E5' }) // Tailwind indigo-600
}

async function syncDynamicRules(rules: RedirectRule[]): Promise<void> {
  try {
    const existing = await chrome.declarativeNetRequest.getDynamicRules()
    const removeRuleIds = existing.map((r) => r.id)
    const addRules = mapRulesToChromeRules(rules)

    console.group(LOG, 'Syncing Rules')
    console.log('Total rules in storage:', rules.length)
    console.log('Active rules to add:', addRules.length)
    console.log('Existing rules to remove (IDs):', removeRuleIds)
    console.log('Adding rules (Chrome format):', addRules)
    
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules })
    
    const current = await chrome.declarativeNetRequest.getDynamicRules()
    updateBadge(current.length)
    console.log('Current active rules after sync:', current)
    console.groupEnd()
  } catch (err) {
    console.group(LOG, 'Sync Failed')
    console.error('Error details:', err)
    console.groupEnd()
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
chrome.runtime.onMessage.addListener(
  (message: { type: string }, _sender, sendResponse) => {
    if (message.type === 'GET_ACTIVE_RULES_COUNT') {
      chrome.declarativeNetRequest
        .getDynamicRules()
        .then((rules) => { sendResponse({ count: rules.length }) })
        .catch(() => { sendResponse({ count: 0 }) })
      return true // keep message channel open
    }
    return false
  }
)
