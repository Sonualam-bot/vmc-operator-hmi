import express, { type Express } from "express";
import cors from "cors";
import { createWorkflowRouter } from "./routes/workflowRoutes.js";
import { createHealthRouter } from "./routes/healthRoutes.js";
import type { WorkflowService } from "./services/WorkflowService.js";

export function createApp(workflowService: WorkflowService): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/health", createHealthRouter());
  app.use("/api/workflow", createWorkflowRouter(workflowService));
  return app;
}
