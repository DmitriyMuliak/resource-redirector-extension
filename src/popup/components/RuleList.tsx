import { useState, useCallback } from 'react'
import type { RedirectRule, CreateRulePayload } from '../../shared/types'
import { RuleItem } from './RuleItem'
import { Modal } from './ui/Modal'
import { RuleForm } from './RuleForm'

interface Props {
  rules: RedirectRule[]
  onToggle: (id: string) => void
  onUpdate: (id: string, payload: CreateRulePayload) => Promise<void>
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function RuleList({ rules, onToggle, onUpdate, onDelete, onDuplicate }: Props) {
  const [editing, setEditing] = useState<RedirectRule | null>(null)
  const [saving,  setSaving]  = useState(false)

  const handleUpdate = useCallback(async (payload: CreateRulePayload) => {
    if (!editing) return
    setSaving(true)
    try {
      await onUpdate(editing.id, payload)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }, [editing, onUpdate])

  return (
    <>
      <div className="flex flex-col gap-2 p-3">
        {rules.map((rule) => (
          <RuleItem
            key={rule.id}
            rule={rule}
            onToggle={() => { onToggle(rule.id) }}
            onEdit={() => { setEditing(rule) }}
            onDelete={() => { onDelete(rule.id) }}
            onDuplicate={() => { onDuplicate(rule.id) }}
          />
        ))}
      </div>

      <Modal isOpen={Boolean(editing)} onClose={() => { setEditing(null) }} title="Edit Rule">
        {editing && (
          <RuleForm
            initialValues={editing}
            onSubmit={handleUpdate}
            onCancel={() => { setEditing(null) }}
            isSubmitting={saving}
          />
        )}
      </Modal>
    </>
  )
}
