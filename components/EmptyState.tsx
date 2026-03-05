interface Props {
  onAddRule: () => void
}

export function EmptyState({ onAddRule }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-14 px-8 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-slate-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">No redirect rules yet</h3>
        <p className="text-xs text-slate-500 max-w-52 leading-relaxed">
          Add rules to intercept requests and redirect them to your local dev server
        </p>
      </div>
      <button
        onClick={onAddRule}
        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
      >
        Add your first rule
      </button>
    </div>
  )
}
