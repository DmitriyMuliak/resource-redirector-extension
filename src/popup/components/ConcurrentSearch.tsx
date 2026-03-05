import { useState, useTransition, useEffect } from 'react'
import type { ChangeEvent } from 'react'

export interface ConcurrentSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * ConcurrentSearch Component
 * Uses React 18 useTransition to decouple input priority from list filtering.
 */
export function ConcurrentSearch({
  value,
  onChange,
  placeholder = 'Search...',
}: ConcurrentSearchProps) {
  // Local state for immediate input feedback (High Priority)
  const [localValue, setLocalValue] = useState(value)

  // useTransition hook to manage low-priority state updates
  const [isPending, startTransition] = useTransition()

  // Sync with external value if it changes (e.g., from a 'Clear' button)
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // 1. Update local input immediately (User sees text as they type)
    setLocalValue(newValue)

    // 2. Mark the heavy filtering task as low-priority
    startTransition(() => {
      // This will update the parent's state and trigger the filteredRules calculation
      onChange(newValue)
    })
  }

  return (
    <div className="relative flex-1">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center">
        {isPending ? (
          // Spinner shown only during heavy background re-rendering
          <div className="w-3.5 h-3.5 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full animate-spin" />
        ) : (
          <svg
            className="w-3.5 h-3.5 text-slate-500"
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
        )}
      </div>

      <input
        type="search"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-800 border 
          transition-all duration-200
          ${isPending ? 'border-indigo-500/30 ring-1 ring-indigo-500/10' : 'border-slate-700/50'}
          text-slate-200 placeholder:text-slate-500
          focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50`}
      />
    </div>
  )
}
