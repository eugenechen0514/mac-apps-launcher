Fork from: [JoshuaRileyDev/mac-apps-launcher](https://github.com/JoshuaRileyDev/mac-apps-launcher)

# Mac Apps Launcher MCP Server

A Model Context Protocol (MCP) server for launching and managing macOS applications.

<a href="https://glama.ai/mcp/servers/@eugenechen0514/mac-apps-launcher">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@eugenechen0514/mac-apps-launcher/badge" alt="mac-apps-launcher MCP server" />
</a>

## Features

- List all applications installed in the `/Applications` folder
- Launch applications by name
- Open files with specific applications

## Installation

Add the following to your Claude Config JSON file

```
{
  "mcpServers": {
    "mac-apps-launcher-mcp": {
      "command": "bunx",
      "args": [
        "@eugenechen/mac-apps-launcher-mcp-server@latest"
      ]
    }
  }
}
```
