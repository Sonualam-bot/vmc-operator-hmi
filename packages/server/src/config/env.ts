export interface AppConfig {
  port: number;
  mongoUri: string;
}

export function loadConfig(): AppConfig {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  return {
    port: Number(process.env.PORT ?? 4000),
    mongoUri,
  };
}
