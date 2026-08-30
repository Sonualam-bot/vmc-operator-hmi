import { OperationStatus, Stage } from "./stage.js";
import { ChecklistItem, JobScenario, RequiredTool, WorkflowState } from "./types.js";

export const JOB_SCENARIO: JobScenario = {
  operationName: "Milling – Bracket Housing",
  quantity: 25,
  material: "Aluminum 6061-T6",
  drawingRevision: "C",
  cncProgram: "O1042 Rev 3",
  fixture: "Vise Fixture #2",
  workOffset: "G54",
};

function machineChecksTemplate(): ChecklistItem[] {
  return [
    { id: "power", label: "Power / control available", confirmed: false },
    { id: "estop", label: "E-stop released", confirmed: false },
    { id: "guard", label: "Guard / door closed", confirmed: false },
    { id: "alarm", label: "No active alarm", confirmed: false },
    { id: "coolant", label: "Lubrication / coolant ready", confirmed: false },
    { id: "reference", label: "Reference return complete", confirmed: false },
  ];
}

function toolsTemplate(): RequiredTool[] {
  return [
    {
      id: "t01",
      toolNumber: "T01",
      type: "Face Mill Ø50 (roughing)",
      programRevision: JOB_SCENARIO.cncProgram,
      confirmed: false,
    },
    {
      id: "t02",
      toolNumber: "T02",
      type: "End Mill Ø10 (profiling)",
      programRevision: JOB_SCENARIO.cncProgram,
      confirmed: false,
    },
    {
      id: "t03",
      toolNumber: "T03",
      type: "Drill Ø8.5 (holes)",
      programRevision: JOB_SCENARIO.cncProgram,
      confirmed: false,
    },
  ];
}

function workpieceTemplate(): ChecklistItem[] {
  return [
    { id: "fixture", label: "Fixture mounted", detail: JOB_SCENARIO.fixture, confirmed: false },
    { id: "orientation", label: "Workpiece orientation set", confirmed: false },
    { id: "clamping", label: "Clamping torque confirmed", confirmed: false },
    {
      id: "revision",
      label: "Material / drawing revision verified",
      detail: `${JOB_SCENARIO.material}, Rev ${JOB_SCENARIO.drawingRevision}`,
      confirmed: false,
    },
    {
      id: "offset",
      label: "Work offset set",
      detail: JOB_SCENARIO.workOffset,
      confirmed: false,
    },
  ];
}

export function createInitialWorkflowState(): WorkflowState {
  return {
    stage: Stage.MachineChecks,
    operationStatus: OperationStatus.Ready,
    scenario: { ...JOB_SCENARIO },
    machineChecks: machineChecksTemplate(),
    tools: toolsTemplate(),
    workpiece: workpieceTemplate(),
    updatedAt: new Date().toISOString(),
  };
}
