import { OperationStatus, Stage } from "./stage.js";

export interface ChecklistItem {
  id: string;
  label: string;
  detail?: string;
  confirmed: boolean;
}

export interface RequiredTool {
  id: string;
  toolNumber: string;
  type: string;
  programRevision: string;
  confirmed: boolean;
}

export interface JobScenario {
  operationName: string;
  quantity: number;
  material: string;
  drawingRevision: string;
  cncProgram: string;
  fixture: string;
  workOffset: string;
}

export interface WorkflowState {
  stage: Stage;
  operationStatus: OperationStatus;
  scenario: JobScenario;
  machineChecks: ChecklistItem[];
  tools: RequiredTool[];
  workpiece: ChecklistItem[];
  updatedAt: string;
}
