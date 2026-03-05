import type { StorageData, RedirectRule } from '../types'
import { STORAGE_KEY, STORAGE_VERSION } from '../constants'

function migrateData(data: Partial<StorageData>): RedirectRule[] {
  return data.rules ?? []
}

export const storageService = {
  async getRules(): Promise<RedirectRule[]> {
    const result = await chrome.storage.local.get(STORAGE_KEY)
    const data = result[STORAGE_KEY] as StorageData | undefined
    if (!data) return []
    if (data.version !== STORAGE_VERSION) return migrateData(data)
    return data.rules ?? []
  },

  async saveRules(rules: RedirectRule[]): Promise<void> {
    const data: StorageData = { rules, version: STORAGE_VERSION }
    await chrome.storage.local.set({ [STORAGE_KEY]: data })
  },

  onRulesChanged(callback: (rules: RedirectRule[]) => void): () => void {
    const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (!(STORAGE_KEY in changes)) return
      const next = changes[STORAGE_KEY].newValue as StorageData | undefined
      callback(next?.rules ?? [])
    }
    chrome.storage.local.onChanged.addListener(listener)
    return () => { chrome.storage.local.onChanged.removeListener(listener) }
  },
}
