import z, { type ZodRawShape } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import {
  LaunchAppInputSchema,
  OpenWithAppInputSchema,
  ListApplicationsInputSchema,
} from "./schemas";
import { type ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { launchApp, listApplications } from "./utils";

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

export interface ToolConfig<Args extends undefined | ZodRawShape = undefined> {
  name: string;
  description: string;
  inputSchema: any;
  schema: z.AnyZodObject;
  cb: ToolCallback<Args>;
}

export const tools: ToolConfig[] = [
  {
    name: "list_applications",
    description: "List all applications installed in the /Applications folder",
    inputSchema: extractSchemaForMCPToolOutput(ListApplicationsInputSchema),
    schema: ListApplicationsInputSchema,
    cb: async () => {
      const apps = await listApplications();
      const appListString = apps.reduce((acc, app, index) => {
        return `${acc}${index + 1}. ${app}\n`;
      }, "");
      const toolResult: CallToolResult = {
        content: [{ type: "text", text: appListString }],
      };
      return toolResult;
    },
  },
  {
    name: "launch_app",
    description: "Launch a Mac application by name",
    inputSchema: extractSchemaForMCPToolOutput(LaunchAppInputSchema),
    schema: LaunchAppInputSchema,
    cb: async (args) => {
      const success = await launchApp(args.appName);
      const toolResult: CallToolResult = {
        content: [
          {
            type: "text",
            text: success
              ? "Application launched successfully"
              : "Failed to launch application",
          },
        ],
      };
      return toolResult;
    },
  },
  {
    name: "open_with_app",
    description: "Open a file or folder with a specific application",
    inputSchema: extractSchemaForMCPToolOutput(OpenWithAppInputSchema),
    schema: OpenWithAppInputSchema,
    cb: async (args) => {
      const success = await openWithApp(args.appName, args.filePath);
      const toolResult: CallToolResult = {
        content: [
          {
            type: "text",
            text: success
              ? "File opened successfully"
              : "Failed to open file with application",
          },
        ],
      };
      return toolResult;
    },
  },
];
