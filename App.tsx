import { useEffect, useCallback } from 'react'
import { useRulesStore } from './stores/rulesStore'
import { useModal } from './hooks/useModal'
import { Header } from './components/Header'
import { RuleList } from './components/RuleList'
import { EmptyState } from './components/EmptyState'
import { Modal } from './components/ui/Modal'
import { Button } from './components/ui/Button'
import { RuleForm } from './components/RuleForm'
import { useState } from 'react'
import type { CreateRulePayload } from '../shared/types'

export function App() {
  const {
    rules,
    isLoaded,
    error,
    initialize,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    duplicateRule,
  } = useRulesStore()
  const addModal = useModal()
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void initialize()
  }, [initialize])

  const filtered = query.trim()
    ? rules.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.sourcePattern.toLowerCase().includes(query.toLowerCase()) ||
          r.targetUrl.toLowerCase().includes(query.toLowerCase()),
      )
    : rules

  const activeCount = rules.filter((r) => r.isEnabled).length

  const handleAdd = useCallback(
    async (payload: CreateRulePayload) => {
      setSaving(true)
      try {
        await addRule(payload)
        addModal.close()
      } finally {
        setSaving(false)
      }
    },
    [addRule, addModal],
  )

  const handleUpdate = useCallback(
    async (id: string, payload: CreateRulePayload) => {
      await updateRule(id, payload)
    },
    [updateRule],
  )

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center flex-1 min-h-48">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 gap-3">
        <p className="text-sm text-red-400 text-center">{error}</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            void initialize()
          }}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header activeCount={activeCount} totalCount={rules.length} />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/50 bg-slate-900/50 shrink-0">
        <div className="relative flex-1">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search rules..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700/50
              text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50"
          />
        </div>
        <Button variant="primary" size="sm" onClick={addModal.open}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Rule
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <EmptyState onAddRule={addModal.open} />
        ) : (
          <RuleList
            rules={filtered}
            onToggle={(id) => {
              void toggleRule(id)
            }}
            onUpdate={handleUpdate}
            onDelete={(id) => {
              void deleteRule(id)
            }}
            onDuplicate={(id) => {
              void duplicateRule(id)
            }}
          />
        )}
      </div>

      {/* Footer */}
      {rules.length > 0 && (
        <footer className="px-4 py-1.5 border-t border-slate-700/50 bg-slate-900/50 shrink-0">
          <p className="text-xs text-slate-600 text-center">
            {activeCount} of {rules.length} active
            {query && filtered.length !== rules.length && (
              <span className="text-slate-600"> &middot; {filtered.length} matching</span>
            )}
          </p>
        </footer>
      )}

      {/* Add Rule Modal */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="Add Redirect Rule">
        <RuleForm onSubmit={handleAdd} onCancel={addModal.close} isSubmitting={saving} />
      </Modal>
    </div>
  )
}
