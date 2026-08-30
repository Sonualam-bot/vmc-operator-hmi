import { Schema, model } from "mongoose";
import type { WorkflowState } from "@vmc-hmi/shared";

export const DEFAULT_SESSION_ID = "default";

export interface WorkflowDocument {
  _id: string;
  state: WorkflowState;
}

const workflowSchema = new Schema<WorkflowDocument>(
  {
    _id: { type: String, required: true },
    state: { type: Schema.Types.Mixed, required: true },
  },
  { versionKey: false },
);

export const WorkflowModel = model<WorkflowDocument>("Workflow", workflowSchema);
