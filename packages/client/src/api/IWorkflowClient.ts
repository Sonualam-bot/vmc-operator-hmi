import type { WorkflowState } from '@vmc-hmi/shared'

export interface IWorkflowClient {
  getState(): Promise<WorkflowState>
  confirmMachineCheck(id: string): Promise<WorkflowState>
  confirmTool(id: string): Promise<WorkflowState>
  confirmWorkpieceItem(id: string): Promise<WorkflowState>
  advanceStage(): Promise<WorkflowState>
  startOperation(): Promise<WorkflowState>
  stopOperation(): Promise<WorkflowState>
  reset(): Promise<WorkflowState>
}
