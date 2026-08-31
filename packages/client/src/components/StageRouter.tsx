import { Stage, type WorkflowState } from '@vmc-hmi/shared'
import type { UseWorkflowResult } from '../hooks/useWorkflow'
import { MachineChecksStage } from './stages/MachineChecksStage'
import { OperationStage } from './stages/OperationStage'
import { ReadyReviewStage } from './stages/ReadyReviewStage'
import { ToolsStage } from './stages/ToolsStage'
import { WorkpieceStage } from './stages/WorkpieceStage'

interface StageRouterProps {
  state: WorkflowState
  workflow: UseWorkflowResult
}

export function StageRouter({ state, workflow }: StageRouterProps) {
  switch (state.stage) {
    case Stage.MachineChecks:
      return (
        <MachineChecksStage items={state.machineChecks} onConfirm={workflow.confirmMachineCheck} onNext={workflow.advanceStage} />
      )
    case Stage.Tools:
      return <ToolsStage items={state.tools} onConfirm={workflow.confirmTool} onNext={workflow.advanceStage} />
    case Stage.Workpiece:
      return (
        <WorkpieceStage items={state.workpiece} onConfirm={workflow.confirmWorkpieceItem} onNext={workflow.advanceStage} />
      )
    case Stage.ReadyReview:
      return <ReadyReviewStage state={state} onProceed={workflow.advanceStage} />
    case Stage.Operation:
      return <OperationStage state={state} onStart={workflow.startOperation} onStop={workflow.stopOperation} />
  }
}
