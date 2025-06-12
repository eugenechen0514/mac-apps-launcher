import z from "zod";

export const ListApplicationsInputSchema = z.object({});
export const LaunchAppInputSchema = z.object({
  appName: z.string(),
});

export const OpenWithAppInputSchema = z.object({
  appName: z.string(),
  filePath: z.string(),
});
