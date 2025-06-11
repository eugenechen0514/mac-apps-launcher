import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import { readdir } from "fs/promises";
import { join } from "path";
import { z } from "zod";
import { tools } from "./tools";
import {
  LaunchAppInputSchema,
  LaunchAppOutputSchema,
  ListApplicationsOutputSchema,
  OpenWithAppInputSchema,
  OpenWithAppOutputSchema,
} from "./schemas";

const execAsync = promisify(exec);

// Helper functions
async function listApplications(): Promise<string[]> {
  try {
    const files = await readdir("/Applications");
    return files.filter((file) => file.endsWith(".app")).sort();
  } catch (error) {
    console.error("Error listing applications:", error);
    return [];
  }
}

async function launchApp(appName: string): Promise<boolean> {
  try {
    const fullAppName = appName.endsWith(".app") ? appName : `${appName}.app`;
    const appPath = join("/Applications", fullAppName);
    await execAsync(`open "${appPath}"`);
    return true;
  } catch (error) {
    console.error("Error launching application:", error);
    return false;
  }
}

async function openWithApp(
  appName: string,
  filePath: string
): Promise<boolean> {
  try {
    const fullAppName = appName.endsWith(".app") ? appName : `${appName}.app`;
    const appPath = join("/Applications", fullAppName);
    await execAsync(`open -a "${appPath}" "${filePath}"`);
    return true;
  } catch (error) {
    console.error("Error opening file with application:", error);
    return false;
  }
}

const server = new Server(
  {
    name: "Mac Apps Launcher MCP Server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    if (!request.params.arguments) {
      throw new Error("Arguments are required");
    }

    switch (request.params.name) {
      case "list_applications": {
        const apps = await listApplications();
        return {
          toolResult: ListApplicationsOutputSchema.parse({
            applications: apps,
          }),
        };
      }
      case "launch_app": {
        const args = LaunchAppInputSchema.parse(request.params.arguments);
        const success = await launchApp(args.appName);
        return {
          toolResult: LaunchAppOutputSchema.parse({
            success,
            message: success
              ? "Application launched successfully"
              : "Failed to launch application",
          }),
        };
      }
      case "open_with_app": {
        const args = OpenWithAppInputSchema.parse(request.params.arguments);
        const success = await openWithApp(args.appName, args.filePath);
        return {
          toolResult: OpenWithAppOutputSchema.parse({
            success,
            message: success
              ? "File opened successfully"
              : "Failed to open file with application",
          }),
        };
      }
      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid arguments");
    }
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mac Launcher MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
