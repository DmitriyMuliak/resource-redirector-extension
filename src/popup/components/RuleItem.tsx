import { clsx } from 'clsx'
import type { RedirectRule } from '../../shared/types'
import { Toggle } from './ui/Toggle'
import { Button } from './ui/Button'

interface Props {
  rule: RedirectRule
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max) + '...'
}

export function RuleItem({ rule, onToggle, onEdit, onDelete, onDuplicate }: Props) {
  return (
    <div
      className={clsx(
        'group flex flex-col gap-2.5 p-3 rounded-xl border transition-all duration-150',
        rule.isEnabled
          ? 'bg-slate-800/60 border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-800/80'
          : 'bg-slate-800/20 border-slate-700/25 opacity-50',
      )}
    >
      {/* Row 1 — toggle + name + actions */}
      <div className="flex items-center gap-2.5">
        <Toggle checked={rule.isEnabled} onChange={onToggle} label={'Toggle ' + rule.name} />

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-200 truncate">
            {rule.name}
          </span>
          {rule.isRegex && (
            <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 border border-violet-500/25 font-mono">
              regex
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button variant="ghost" size="xs" onClick={onDuplicate} title="Duplicate">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </Button>
          <Button variant="ghost" size="xs" onClick={onEdit} title="Edit">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </Button>
          <Button variant="danger" size="xs" onClick={onDelete} title="Delete">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Row 2 — source → target */}
      <div className="flex flex-col gap-1 pl-11">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-8 text-right shrink-0">from</span>
          <code className="text-xs text-amber-400/90 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/40 font-mono truncate">
            {truncate(rule.sourcePattern, 52)}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 w-8 text-right shrink-0">to</span>
          <code className="text-xs text-emerald-400/90 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/40 font-mono truncate">
            {truncate(rule.targetUrl, 52)}
          </code>
        </div>
      </div>

      {/* Row 3 — resource type badges */}
      <div className="flex items-center gap-1.5 pl-11 flex-wrap">
        {rule.resourceTypes.slice(0, 5).map((t) => (
          <span key={t}
            className="text-xs px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400 border border-slate-600/30">
            {t === 'xmlhttprequest' ? 'xhr' : t.replace('_', '\u2009')}
          </span>
        ))}
        {rule.resourceTypes.length > 5 && (
          <span className="text-xs text-slate-500">+{rule.resourceTypes.length - 5} more</span>
        )}
      </div>
    </div>
  )
}
