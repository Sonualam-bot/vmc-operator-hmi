import { OperationStatus, type WorkflowState } from '@vmc-hmi/shared'
import { ActionButton } from '../shared/ActionButton'
import { StatusBadge } from '../shared/StatusBadge'

interface OperationStageProps {
  state: WorkflowState
  onStart: () => void
  onStop: () => void
}

export function OperationStage({ state, onStart, onStop }: OperationStageProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <div className="text-2xl font-bold text-slate-900">{state.scenario.operationName}</div>
        <div className="mt-1 text-sm text-slate-500">Qty {state.scenario.quantity}</div>
      </div>
      <StatusBadge status={state.operationStatus} />

      {state.operationStatus === OperationStatus.Running ? (
        <ActionButton variant="danger" onClick={onStop}>
          Stop Operation
        </ActionButton>
      ) : (
        <ActionButton variant="primary" onClick={onStart} disabled={state.operationStatus === OperationStatus.Stopped}>
          Start Operation
        </ActionButton>
      )}

      {state.operationStatus === OperationStatus.Stopped && (
        <p className="text-sm text-slate-500">Operation stopped. Use "Reset demo" above to run it again.</p>
      )}
    </div>
  )
}
