import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { RedirectRule, CreateRulePayload, UpdateRulePayload } from '../../shared/types'
import { storageService } from '../../shared/utils/storage'

interface RulesStore {
  rules: RedirectRule[]
  isLoaded: boolean
  error: string | null
  initialize: () => Promise<void>
  addRule: (payload: CreateRulePayload) => Promise<void>
  updateRule: (id: string, payload: UpdateRulePayload) => Promise<void>
  deleteRule: (id: string) => Promise<void>
  toggleRule: (id: string) => Promise<void>
  duplicateRule: (id: string) => Promise<void>
}

export const useRulesStore = create<RulesStore>()(
  devtools(
    (set, get) => ({
      rules: [],
      isLoaded: false,
      error: null,

      initialize: async () => {
        try {
          const rules = await storageService.getRules()
          set({ rules, isLoaded: true, error: null }, false, 'initialize')
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load rules'
          set({ isLoaded: true, error: message }, false, 'initialize/error')
        }
      },

      addRule: async (payload) => {
        const now = Date.now()
        const newRule: RedirectRule = { ...payload, id: uuidv4(), createdAt: now, updatedAt: now }
        const next = [...get().rules, newRule]
        set({ rules: next }, false, 'addRule')
        await storageService.saveRules(next)
      },

      updateRule: async (id, payload) => {
        const next = get().rules.map((r) =>
          r.id === id ? { ...r, ...payload, updatedAt: Date.now() } : r,
        )
        set({ rules: next }, false, 'updateRule')
        await storageService.saveRules(next)
      },

      deleteRule: async (id) => {
        const next = get().rules.filter((r) => r.id !== id)
        set({ rules: next }, false, 'deleteRule')
        await storageService.saveRules(next)
      },

      toggleRule: async (id) => {
        const next = get().rules.map((r) =>
          r.id === id ? { ...r, isEnabled: !r.isEnabled, updatedAt: Date.now() } : r,
        )
        set({ rules: next }, false, 'toggleRule')
        await storageService.saveRules(next)
      },

      duplicateRule: async (id) => {
        const source = get().rules.find((r) => r.id === id)
        if (!source) return
        const now = Date.now()
        const copy: RedirectRule = { ...source, id: uuidv4(), name: source.name + ' (copy)', createdAt: now, updatedAt: now }
        const next = [...get().rules, copy]
        set({ rules: next }, false, 'duplicateRule')
        await storageService.saveRules(next)
      },
    }),
    { name: 'RulesStore' },
  ),
)
