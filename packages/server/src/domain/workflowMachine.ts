import {
  ChecklistItem,
  OperationStatus,
  RequiredTool,
  Stage,
  STAGE_ORDER,
  WorkflowState,
} from "@vmc-hmi/shared";
import { IllegalTransitionError, ItemNotFoundError } from "./errors.js";

function touch(): Pick<WorkflowState, "updatedAt"> {
  return { updatedAt: new Date().toISOString() };
}

function confirmItem<T extends ChecklistItem | RequiredTool>(items: T[], id: string): T[] {
  const found = items.some((item) => item.id === id);
  if (!found) {
    throw new ItemNotFoundError(`No item with id "${id}"`);
  }
  return items.map((item) => (item.id === id ? { ...item, confirmed: true } : item));
}

export function isStageComplete(state: WorkflowState): boolean {
  switch (state.stage) {
    case Stage.MachineChecks:
      return state.machineChecks.every((item) => item.confirmed);
    case Stage.Tools:
      return state.tools.every((tool) => tool.confirmed);
    case Stage.Workpiece:
      return state.workpiece.every((item) => item.confirmed);
    case Stage.ReadyReview:
    case Stage.Operation:
      return true;
  }
}

export function confirmMachineCheck(state: WorkflowState, id: string): WorkflowState {
  if (state.stage !== Stage.MachineChecks) {
    throw new IllegalTransitionError("Machine checks can only be confirmed during the Machine Checks stage");
  }
  return { ...state, machineChecks: confirmItem(state.machineChecks, id), ...touch() };
}

export function confirmTool(state: WorkflowState, id: string): WorkflowState {
  if (state.stage !== Stage.Tools) {
    throw new IllegalTransitionError("Tools can only be confirmed during the Required Tools stage");
  }
  return { ...state, tools: confirmItem(state.tools, id), ...touch() };
}

export function confirmWorkpieceItem(state: WorkflowState, id: string): WorkflowState {
  if (state.stage !== Stage.Workpiece) {
    throw new IllegalTransitionError("Workpiece items can only be confirmed during the Workpiece Setup stage");
  }
  return { ...state, workpiece: confirmItem(state.workpiece, id), ...touch() };
}

export function advanceStage(state: WorkflowState): WorkflowState {
  if (!isStageComplete(state)) {
    throw new IllegalTransitionError(`Cannot advance: stage "${state.stage}" is not fully confirmed`);
  }
  const currentIndex = STAGE_ORDER.indexOf(state.stage);
  if (currentIndex === STAGE_ORDER.length - 1) {
    throw new IllegalTransitionError("Already at the final stage");
  }
  return { ...state, stage: STAGE_ORDER[currentIndex + 1], ...touch() };
}

export function startOperation(state: WorkflowState): WorkflowState {
  if (state.stage !== Stage.Operation) {
    throw new IllegalTransitionError("Operation can only be started from the Operation stage");
  }
  if (state.operationStatus !== OperationStatus.Ready) {
    throw new IllegalTransitionError(`Cannot start: operation status is "${state.operationStatus}", not READY`);
  }
  return { ...state, operationStatus: OperationStatus.Running, ...touch() };
}

export function stopOperation(state: WorkflowState): WorkflowState {
  if (state.operationStatus !== OperationStatus.Running) {
    throw new IllegalTransitionError(`Cannot stop: operation status is "${state.operationStatus}", not RUNNING`);
  }
  return { ...state, operationStatus: OperationStatus.Stopped, ...touch() };
}
