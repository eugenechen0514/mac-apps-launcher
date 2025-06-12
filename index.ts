#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools, type ToolConfig } from "./tools";

function loadTools(server: McpServer, tools: ToolConfig[]) {
  tools.forEach((tool) => {
    server.tool(
      tool.name,
      tool.description,
      tool.annotations,
      tool.schema,
      tool.cb
    );
  });
}

function initServer() {
  const server = new McpServer(
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
  loadTools(server, tools);
  return server;
}

async function runServer() {
  const server = initServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Mac Launcher MCP Server running on stdio");
}

// run
await runServer();
