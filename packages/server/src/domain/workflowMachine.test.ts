import { describe, expect, it } from "vitest";
import { createInitialWorkflowState, OperationStatus, Stage } from "@vmc-hmi/shared";
import {
  advanceStage,
  confirmMachineCheck,
  confirmTool,
  confirmWorkpieceItem,
  startOperation,
  stopOperation,
} from "./workflowMachine.js";
import { IllegalTransitionError, ItemNotFoundError } from "./errors.js";

function confirmAll<T extends { id: string }>(
  state: ReturnType<typeof createInitialWorkflowState>,
  items: T[],
  confirmFn: (s: typeof state, id: string) => typeof state,
) {
  return items.reduce((acc, item) => confirmFn(acc, item.id), state);
}

describe("workflowMachine", () => {
  it("blocks advancing past Machine Checks until every check is confirmed", () => {
    const state = createInitialWorkflowState();
    expect(() => advanceStage(state)).toThrow(IllegalTransitionError);

    const partiallyConfirmed = confirmMachineCheck(state, state.machineChecks[0].id);
    expect(() => advanceStage(partiallyConfirmed)).toThrow(IllegalTransitionError);
  });

  it("advances to Tools once every machine check is confirmed", () => {
    const state = createInitialWorkflowState();
    const allConfirmed = confirmAll(state, state.machineChecks, confirmMachineCheck);
    const next = advanceStage(allConfirmed);
    expect(next.stage).toBe(Stage.Tools);
  });

  it("rejects confirming an item that does not exist", () => {
    const state = createInitialWorkflowState();
    expect(() => confirmMachineCheck(state, "not-a-real-id")).toThrow(ItemNotFoundError);
  });

  it("rejects confirming a tool while not on the Tools stage", () => {
    const state = createInitialWorkflowState();
    expect(() => confirmTool(state, state.tools[0].id)).toThrow(IllegalTransitionError);
  });

  it("walks Machine Checks -> Tools -> Workpiece -> Ready Review -> Operation", () => {
    let state = createInitialWorkflowState();
    state = advanceStage(confirmAll(state, state.machineChecks, confirmMachineCheck));
    expect(state.stage).toBe(Stage.Tools);

    state = advanceStage(confirmAll(state, state.tools, confirmTool));
    expect(state.stage).toBe(Stage.Workpiece);

    state = advanceStage(confirmAll(state, state.workpiece, confirmWorkpieceItem));
    expect(state.stage).toBe(Stage.ReadyReview);

    state = advanceStage(state);
    expect(state.stage).toBe(Stage.Operation);
    expect(state.operationStatus).toBe(OperationStatus.Ready);
  });

  it("rejects Start before the Operation stage is reached", () => {
    const state = createInitialWorkflowState();
    expect(() => startOperation(state)).toThrow(IllegalTransitionError);
  });

  it("moves READY -> RUNNING on Start, and RUNNING -> STOPPED on Stop while preserving the stage", () => {
    let state = createInitialWorkflowState();
    state = advanceStage(confirmAll(state, state.machineChecks, confirmMachineCheck));
    state = advanceStage(confirmAll(state, state.tools, confirmTool));
    state = advanceStage(confirmAll(state, state.workpiece, confirmWorkpieceItem));
    state = advanceStage(state);

    const running = startOperation(state);
    expect(running.operationStatus).toBe(OperationStatus.Running);
    expect(running.stage).toBe(Stage.Operation);

    const stopped = stopOperation(running);
    expect(stopped.operationStatus).toBe(OperationStatus.Stopped);
    expect(stopped.stage).toBe(Stage.Operation);
  });

  it("rejects Stop when the operation is not currently running", () => {
    const state = createInitialWorkflowState();
    expect(() => stopOperation(state)).toThrow(IllegalTransitionError);
  });

  it("rejects advancing past the final stage", () => {
    let state = createInitialWorkflowState();
    state = advanceStage(confirmAll(state, state.machineChecks, confirmMachineCheck));
    state = advanceStage(confirmAll(state, state.tools, confirmTool));
    state = advanceStage(confirmAll(state, state.workpiece, confirmWorkpieceItem));
    state = advanceStage(state);
    expect(() => advanceStage(state)).toThrow(IllegalTransitionError);
  });
});
