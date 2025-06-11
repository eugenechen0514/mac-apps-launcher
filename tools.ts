import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { LaunchAppInputSchema, OpenWithAppInputSchema } from "./schemas";
import { type Tool } from "@modelcontextprotocol/sdk/types.js";

function extractSchemaForMCPTool(schema: any) {
  return {
    type: schema.type,
    properties: schema.properties,
    required: schema.required,
  };
}

function extractSchemaForMCPToolOutput(schema: any) {
  return extractSchemaForMCPTool(zodToJsonSchema(schema));
}

export const tools: Tool[] = [
  {
    name: "list_applications",
    description: "List all applications installed in the /Applications folder",
    inputSchema: extractSchemaForMCPToolOutput(z.object({})),
  },
  {
    name: "launch_app",
    description: "Launch a Mac application by name",
    inputSchema: extractSchemaForMCPToolOutput(LaunchAppInputSchema),
  },
  {
    name: "open_with_app",
    description: "Open a file or folder with a specific application",
    inputSchema: extractSchemaForMCPToolOutput(OpenWithAppInputSchema),
  },
];
