import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'neutral'

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-slate-300',
  danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white disabled:bg-slate-300',
  neutral: 'bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white disabled:bg-slate-300',
}

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function ActionButton({ variant = 'primary', className = '', ...rest }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-14 cursor-pointer rounded-xl px-8 text-lg font-semibold shadow-sm transition-colors disabled:cursor-not-allowed disabled:shadow-none ${VARIANT_STYLES[variant]} ${className}`}
      {...rest}
    />
  )
}
