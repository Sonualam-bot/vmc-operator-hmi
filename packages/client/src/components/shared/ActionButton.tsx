import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'neutral'

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-slate-300',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:bg-slate-300',
  neutral: 'bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white disabled:bg-slate-300',
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

export function ActionButton({
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...rest
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-xl px-8 text-lg font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:shadow-none ${VARIANT_STYLES[variant]} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
        </svg>
      )}
      {children}
    </button>
  )
}
