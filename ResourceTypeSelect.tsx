import { clsx } from 'clsx'
import type { ResourceType } from '../../../shared/types'
import { ALL_RESOURCE_TYPES, RESOURCE_TYPE_LABELS } from '../../../shared/constants'

interface Props {
  value: ResourceType[]
  onChange: (types: ResourceType[]) => void
  error?: string
}

export function ResourceTypeSelect({ value, onChange, error }: Props) {
  const toggle = (t: ResourceType) => {
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t])
  }
  const allSelected = value.length === ALL_RESOURCE_TYPES.length

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Resource Types
        </span>
        <button
          type="button"
          onClick={() => {
            onChange(allSelected ? [] : [...ALL_RESOURCE_TYPES])
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_RESOURCE_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              toggle(t)
            }}
            className={clsx(
              'px-2.5 py-0.5 text-xs rounded-md font-medium border transition-all duration-100',
              value.includes(t)
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-800 border-slate-600/50 text-slate-500 hover:text-slate-300 hover:border-slate-500',
            )}
          >
            {RESOURCE_TYPE_LABELS[t]}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
