import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'xs' | 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border-transparent',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600/50',
  danger:    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20',
  ghost:     'bg-transparent hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border-transparent',
}

const SIZES: Record<Size, string> = {
  xs: 'px-2 py-0.5 text-xs gap-1',
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3.5 py-1.5 text-sm gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled ?? isLoading}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg border transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant], SIZES[size], className,
      )}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
