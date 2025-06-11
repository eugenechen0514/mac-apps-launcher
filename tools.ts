import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { LaunchAppInputSchema, OpenWithAppInputSchema } from "./schemas";
import { type Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "list_applications",
    description: "List all applications installed in the /Applications folder",
    inputSchema: zodToJsonSchema(z.object({})),
  },
  {
    name: "launch_app",
    description: "Launch a Mac application by name",
    inputSchema: zodToJsonSchema(LaunchAppInputSchema),
  },
  {
    name: "open_with_app",
    description: "Open a file or folder with a specific application",
    inputSchema: zodToJsonSchema(OpenWithAppInputSchema),
  },
];
