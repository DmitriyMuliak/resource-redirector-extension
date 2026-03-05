interface Props {
  activeCount: number
  totalCount: number
}

export function Header({ activeCount, totalCount }: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700/50 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-100 leading-none">URL Redirector</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dev Tools</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-xs text-slate-500">Active</p>
          <p className="text-sm font-bold text-indigo-400 leading-none">
            {activeCount}
            <span className="text-slate-600">/{totalCount}</span>
          </p>
        </div>
        <div
          className={[
            'w-2 h-2 rounded-full transition-colors',
            activeCount > 0
              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
              : 'bg-slate-600',
          ].join(' ')}
        />
      </div>
    </header>
  )
}
