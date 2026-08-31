import type { WorkflowState } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'

interface ReadyReviewStageProps {
  state: WorkflowState
  onProceed: () => void
}

export function ReadyReviewStage({ state, onProceed }: ReadyReviewStageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-8 text-center">
        <div className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Status</div>
        <div className="mt-1 text-3xl font-extrabold text-emerald-800">READY</div>
      </div>

      <ReviewSection title="Machine Checks" items={state.machineChecks.map((item) => item.label)} />
      <ReviewSection title="Required Tools" items={state.tools.map((tool) => `${tool.toolNumber} — ${tool.type}`)} />
      <ReviewSection title="Workpiece Setup" items={state.workpiece.map((item) => item.label)} />

      <ActionButton variant="primary" onClick={onProceed}>
        Proceed to Operation
      </ActionButton>
    </div>
  )
}

function ReviewSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((label) => (
          <li key={label} className="flex items-center gap-2 text-slate-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              ✓
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
