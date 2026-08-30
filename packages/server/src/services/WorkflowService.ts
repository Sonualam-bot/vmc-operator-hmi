import type { WorkflowState } from "@vmc-hmi/shared";
import type { IWorkflowRepository } from "../repositories/IWorkflowRepository.js";
import * as machine from "../domain/workflowMachine.js";

export class WorkflowService {
  constructor(private readonly repository: IWorkflowRepository) {}

  getState(): Promise<WorkflowState> {
    return this.repository.getState();
  }

  confirmMachineCheck(id: string): Promise<WorkflowState> {
    return this.applyTransition((state) => machine.confirmMachineCheck(state, id));
  }

  confirmTool(id: string): Promise<WorkflowState> {
    return this.applyTransition((state) => machine.confirmTool(state, id));
  }

  confirmWorkpieceItem(id: string): Promise<WorkflowState> {
    return this.applyTransition((state) => machine.confirmWorkpieceItem(state, id));
  }

  advanceStage(): Promise<WorkflowState> {
    return this.applyTransition(machine.advanceStage);
  }

  startOperation(): Promise<WorkflowState> {
    return this.applyTransition(machine.startOperation);
  }

  stopOperation(): Promise<WorkflowState> {
    return this.applyTransition(machine.stopOperation);
  }

  reset(): Promise<WorkflowState> {
    return this.repository.reset();
  }

  private async applyTransition(
    transition: (state: WorkflowState) => WorkflowState,
  ): Promise<WorkflowState> {
    const current = await this.repository.getState();
    const next = transition(current);
    await this.repository.save(next);
    return next;
  }
}
