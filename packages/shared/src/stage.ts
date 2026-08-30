export enum Stage {
  MachineChecks = "MACHINE_CHECKS",
  Tools = "TOOLS",
  Workpiece = "WORKPIECE",
  ReadyReview = "READY_REVIEW",
  Operation = "OPERATION",
}

export const STAGE_ORDER: Stage[] = [
  Stage.MachineChecks,
  Stage.Tools,
  Stage.Workpiece,
  Stage.ReadyReview,
  Stage.Operation,
];

export enum OperationStatus {
  Ready = "READY",
  Running = "RUNNING",
  Stopped = "STOPPED",
}
