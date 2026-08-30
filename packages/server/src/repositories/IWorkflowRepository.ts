import type { WorkflowState } from "@vmc-hmi/shared";

export interface IWorkflowRepository {
  getState(): Promise<WorkflowState>;
  save(state: WorkflowState): Promise<void>;
  reset(): Promise<WorkflowState>;
}
