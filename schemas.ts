import z from "zod";

// helper
function wrapToolResultSchema<T>(schema: z.ZodType<T>) {
  return z.object({
    toolResult: schema,
  });
}

// Define schemas
export const ListApplicationsOutputSchema = z.object({
  applications: z.array(z.string()),
});
export const WrappedListApplicationsOutputSchema = wrapToolResultSchema(
  ListApplicationsOutputSchema
);

export const LaunchAppInputSchema = z.object({
  appName: z.string(),
});

export const LaunchAppOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export const WrappedLaunchAppOutputSchema = wrapToolResultSchema(
  LaunchAppOutputSchema
);

export const OpenWithAppInputSchema = z.object({
  appName: z.string(),
  filePath: z.string(),
});

export const OpenWithAppOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export const WrappedOpenWithAppOutputSchema = wrapToolResultSchema(
  OpenWithAppOutputSchema
);
