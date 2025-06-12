import z, { type ZodRawShape } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { type ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  CallToolResult,
  ToolAnnotations,
} from "@modelcontextprotocol/sdk/types.js";
import { launchApp, listApplications, openWithApp } from "./utils";

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

export const ListApplicationsInputSchema = {};
export const LaunchAppInputSchema = {
  appName: z.string(),
};

export const OpenWithAppInputSchema = {
  appName: z.string(),
  filePath: z.string(),
};

export interface ToolConfig<Args extends ZodRawShape = ZodRawShape> {
  name: string;
  description: string;
  inputSchema: any;
  annotations: ToolAnnotations;
  schema: Args;
  cb: ToolCallback<Args>;
}

const listApplicationsConfig: ToolConfig<typeof ListApplicationsInputSchema> = {
  name: "list_applications",
  description: "List all applications installed in the /Applications folder",
  inputSchema: extractSchemaForMCPToolOutput(ListApplicationsInputSchema),
  annotations: {
    title: "列出所有應用程式",
    readOnlyHint: true, // 只讀取應用程式列表，不修改系統
    destructiveHint: false, // 不執行任何破壞性操作
    idempotentHint: true, // 重複呼叫會得到相同結果(若應用程式列表未變)
    openWorldHint: false, // 只與本機檔案系統互動，不連接外部系統
  },
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
};

const launchAppConfig: ToolConfig<typeof LaunchAppInputSchema> = {
  name: "launch_app",
  description: "Launch a Mac application by name",
  inputSchema: extractSchemaForMCPToolOutput(LaunchAppInputSchema),
  annotations: {
    title: "啟動應用程式",
    readOnlyHint: false, // 會修改系統狀態(啟動應用程式)
    destructiveHint: false, // 不執行破壞性操作
    idempotentHint: false, // 重複啟動可能有不同結果
    openWorldHint: true, // 與外部應用程式互動
  },
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
};
const openWithAppConfig: ToolConfig<typeof OpenWithAppInputSchema> = {
  name: "open_with_app",
  description: "Open a file or folder with a specific application",
  inputSchema: extractSchemaForMCPToolOutput(OpenWithAppInputSchema),
  annotations: {
    title: "用應用程式開啟檔案",
    readOnlyHint: false, // 會修改系統狀態
    destructiveHint: false, // 不執行破壞性操作
    idempotentHint: false, // 重複開啟可能有不同結果
    openWorldHint: true, // 與外部應用程式和檔案互動
  },
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
};

export const tools: ToolConfig<any>[] = [
  listApplicationsConfig,
  launchAppConfig,
  openWithAppConfig,
];
