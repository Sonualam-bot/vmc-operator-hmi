import { createInitialWorkflowState, type WorkflowState } from "@vmc-hmi/shared";
import type { IWorkflowRepository } from "./IWorkflowRepository.js";
import { DEFAULT_SESSION_ID, WorkflowModel } from "./workflowModel.js";

export class MongoWorkflowRepository implements IWorkflowRepository {
  async getState(): Promise<WorkflowState> {
    const doc = await WorkflowModel.findById(DEFAULT_SESSION_ID).lean();
    if (doc) {
      return doc.state;
    }
    return this.reset();
  }

  async save(state: WorkflowState): Promise<void> {
    await WorkflowModel.findByIdAndUpdate(
      DEFAULT_SESSION_ID,
      { _id: DEFAULT_SESSION_ID, state },
      { upsert: true },
    );
  }

  async reset(): Promise<WorkflowState> {
    const initial = createInitialWorkflowState();
    await this.save(initial);
    return initial;
  }
}
