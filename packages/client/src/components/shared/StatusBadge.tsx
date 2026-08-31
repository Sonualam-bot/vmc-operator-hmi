import { OperationStatus } from '@vmc-hmi/shared'

const STYLES: Record<OperationStatus, string> = {
  [OperationStatus.Ready]: 'bg-amber-100 text-amber-800 border-amber-300',
  [OperationStatus.Running]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  [OperationStatus.Stopped]: 'bg-slate-200 text-slate-700 border-slate-300',
}

export function StatusBadge({ status }: { status: OperationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
