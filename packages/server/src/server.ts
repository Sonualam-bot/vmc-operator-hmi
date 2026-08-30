import "dotenv/config";
import mongoose from "mongoose";
import { loadConfig } from "./config/env.js";
import { MongoWorkflowRepository } from "./repositories/MongoWorkflowRepository.js";
import { WorkflowService } from "./services/WorkflowService.js";
import { createApp } from "./app.js";

async function main(): Promise<void> {
  const config = loadConfig();

  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  const repository = new MongoWorkflowRepository();
  const workflowService = new WorkflowService(repository);
  const app = createApp(workflowService);

  app.listen(config.port, () => {
    console.log(`VMC Operator HMI server listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
