import type { PropsWithChildren } from 'react'
import { Stage, STAGE_ORDER, type WorkflowState } from '@vmc-hmi/shared'

const STAGE_LABELS: Record<Stage, string> = {
  [Stage.MachineChecks]: 'Machine Checks',
  [Stage.Tools]: 'Required Tools',
  [Stage.Workpiece]: 'Workpiece Setup',
  [Stage.ReadyReview]: 'Ready Review',
  [Stage.Operation]: 'Operation',
}

const STAGE_INSTRUCTIONS: Record<Stage, string> = {
  [Stage.MachineChecks]: 'Confirm each machine check before continuing.',
  [Stage.Tools]: 'Insert and confirm each required tool.',
  [Stage.Workpiece]: 'Arrange, clamp, and confirm each workpiece setup item.',
  [Stage.ReadyReview]: 'Review the completed checklist, then proceed to operation.',
  [Stage.Operation]: 'Start the operation when ready, or stop it at any time.',
}

interface StageShellProps extends PropsWithChildren {
  state: WorkflowState
  onReset: () => void
}

export function StageShell({ state, onReset, children }: StageShellProps) {
  const currentIndex = STAGE_ORDER.indexOf(state.stage)

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-500">VMC Operator HMI</div>
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer text-xs font-medium text-slate-400 underline underline-offset-2 hover:text-slate-600"
            >
              Reset demo
            </button>
          </div>

          <ol className="flex items-center gap-2">
            {STAGE_ORDER.map((stage, idx) => (
              <li key={stage} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    idx < currentIndex ? 'bg-emerald-500' : idx === currentIndex ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              </li>
            ))}
          </ol>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">{STAGE_LABELS[state.stage]}</div>
            <div className="mt-1 text-base text-slate-600">{STAGE_INSTRUCTIONS[state.stage]}</div>
          </div>
        </header>

        <main>{children}</main>
      </div>
    </div>
  )
}
