import path from "node:path";
import express, { type Express } from "express";
import cors from "cors";
import { createWorkflowRouter } from "./routes/workflowRoutes.js";
import { createHealthRouter } from "./routes/healthRoutes.js";
import type { WorkflowService } from "./services/WorkflowService.js";

export function createApp(workflowService: WorkflowService, clientDistPath?: string): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api/health", createHealthRouter());
  app.use("/api/workflow", createWorkflowRouter(workflowService));

  if (clientDistPath) {
    app.use(express.static(clientDistPath));
    app.use((req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api")) {
        next();
        return;
      }
      res.sendFile(path.join(clientDistPath, "index.html"));
    });
  }

  return app;
}
