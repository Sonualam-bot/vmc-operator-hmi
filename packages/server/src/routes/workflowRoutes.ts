import { Router, type Request, type Response } from "express";
import type { WorkflowState } from "@vmc-hmi/shared";
import type { WorkflowService } from "../services/WorkflowService.js";
import { IllegalTransitionError, ItemNotFoundError } from "../domain/errors.js";

function handle<P extends Record<string, string> = Record<string, never>>(
  fn: (req: Request<P>) => Promise<WorkflowState>,
) {
  return async (req: Request<P>, res: Response) => {
    try {
      const result = await fn(req);
      res.json(result);
    } catch (err) {
      if (err instanceof ItemNotFoundError) {
        res.status(404).json({ error: err.message });
      } else if (err instanceof IllegalTransitionError) {
        res.status(409).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}

export function createWorkflowRouter(service: WorkflowService): Router {
  const router = Router();

  router.get("/", handle(() => service.getState()));
  router.post("/machine-checks/:id/confirm", handle<{ id: string }>((req) => service.confirmMachineCheck(req.params.id)));
  router.post("/tools/:id/confirm", handle<{ id: string }>((req) => service.confirmTool(req.params.id)));
  router.post("/workpiece/:id/confirm", handle<{ id: string }>((req) => service.confirmWorkpieceItem(req.params.id)));
  router.post("/advance", handle(() => service.advanceStage()));
  router.post("/operation/start", handle(() => service.startOperation()));
  router.post("/operation/stop", handle(() => service.stopOperation()));
  router.post("/reset", handle(() => service.reset()));

  return router;
}
