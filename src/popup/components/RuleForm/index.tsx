import { useState, useCallback } from 'react'
import { clsx } from 'clsx'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { ResourceTypeSelect } from './ResourceTypeSelect'
import { validateRule } from '../../../shared/utils/validators'
import { DEFAULT_RESOURCE_TYPES } from '../../../shared/constants'
import type { CreateRulePayload, RedirectRule } from '../../../shared/types'

interface Props {
  initialValues?: Partial<RedirectRule>
  onSubmit: (payload: CreateRulePayload) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

type TouchedMap = Partial<Record<keyof CreateRulePayload, boolean>>

export function RuleForm({ initialValues, onSubmit, onCancel, isSubmitting }: Props) {
  const [values, setValues] = useState<CreateRulePayload>({
    name:           initialValues?.name           ?? '',
    sourcePattern:  initialValues?.sourcePattern  ?? '',
    targetUrl:      initialValues?.targetUrl      ?? '',
    isRegex:        initialValues?.isRegex        ?? false,
    isEnabled:      initialValues?.isEnabled      ?? true,
    resourceTypes:  initialValues?.resourceTypes  ?? [...DEFAULT_RESOURCE_TYPES],
  })
  const [errors,  setErrors]  = useState<ReturnType<typeof validateRule>['errors']>({})
  const [touched, setTouched] = useState<TouchedMap>({})

  const set = useCallback(<K extends keyof CreateRulePayload>(k: K, v: CreateRulePayload[K]) => {
    setValues((prev) => ({ ...prev, [k]: v }))
    setErrors((prev) => ({ ...prev, [k]: undefined }))
  }, [])

  const blur = useCallback((k: keyof CreateRulePayload) => {
    setTouched((prev) => ({ ...prev, [k]: true }))
  }, [])

  const handleSubmit = async () => {
    const result = validateRule(values)
    if (!result.isValid) {
      setErrors(result.errors)
      const allTouched = Object.fromEntries(
        Object.keys(result.errors).map((k) => [k, true]),
      ) as TouchedMap
      setTouched(allTouched)
      return
    }
    await onSubmit(values)
  }

  const isEdit = Boolean(initialValues?.id)

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <Input
        label="Rule Name"
        placeholder="e.g. Redirect app bundle to localhost"
        value={values.name}
        onChange={(e) => { set('name', e.target.value) }}
        onBlur={() => { blur('name') }}
        error={touched.name ? errors.name : undefined}
        autoFocus
      />

      {/* Pattern mode toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide shrink-0">
          Match Mode
        </span>
        <div className="flex rounded-lg overflow-hidden border border-slate-600/50 text-xs">
          {(['url', 'regex'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => { set('isRegex', mode === 'regex') }}
              className={clsx(
                'px-3 py-1.5 font-medium transition-colors',
                (mode === 'regex') === values.isRegex
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200',
              )}
            >
              {mode === 'url' ? 'URL Filter' : 'Regex'}
            </button>
          ))}
        </div>
      </div>

      {/* Source */}
      <Input
        label="Source Pattern"
        placeholder={values.isRegex
          ? 'e.g. https://cdn\\.example\\.com/(.*)'
          : 'e.g. https://cdn.example.com/app.js or *cdn.example.com*'}
        value={values.sourcePattern}
        onChange={(e) => { set('sourcePattern', e.target.value) }}
        onBlur={() => { blur('sourcePattern') }}
        error={touched.sourcePattern ? errors.sourcePattern : undefined}
        hint={values.isRegex ? 'Use capture groups in target URL: $1, $2, ...' : 'Use * as wildcard'}
      />

      {/* Target */}
      <Input
        label="Target URL"
        placeholder={values.isRegex
          ? 'e.g. http://localhost:3000/$1'
          : 'e.g. http://localhost:3000/app.js'}
        value={values.targetUrl}
        onChange={(e) => { set('targetUrl', e.target.value) }}
        onBlur={() => { blur('targetUrl') }}
        error={touched.targetUrl ? errors.targetUrl : undefined}
      />

      {/* Resource types */}
      <ResourceTypeSelect
        value={values.resourceTypes}
        onChange={(v) => { set('resourceTypes', v) }}
        error={touched.resourceTypes ? errors.resourceTypes : undefined}
      />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="primary" onClick={() => { void handleSubmit() }} isLoading={isSubmitting} className="flex-1">
          {isEdit ? 'Save Changes' : 'Add Rule'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
