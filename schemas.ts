import z from "zod";

// Define schemas
export const LaunchAppInputSchema = z.object({
  appName: z.string(),
});

export const OpenWithAppInputSchema = z.object({
  appName: z.string(),
  filePath: z.string(),
});
