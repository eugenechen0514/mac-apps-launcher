import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createInterface, Interface } from "readline";

// 建立使用者輸入介面
const userInput: Interface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 初始化 MCP 客戶端
async function initClient(): Promise<Client> {
  try {
    console.log("正在連接到 Mac Apps Launcher MCP 伺服器...");

    // 建立 StdioClientTransport，指定要執行的命令
    const transport = new StdioClientTransport({
      command: "bun",
      args: ["index.ts"],
    });

    // 建立 MCP 客戶端
    const client = new Client({
      name: "mac-launcher-test-client",
      version: "1.0.0",
    });

    // 連接到伺服器
    await client.connect(transport);
    console.log("已成功連接到 MCP 伺服器！");

    return client;
  } catch (error) {
    console.error("連接 MCP 伺服器時發生錯誤:", error);
    process.exit(1);
  }
}

// 列出所有可用工具
async function listTools(client: Client): Promise<void> {
  try {
    console.log("正在獲取可用工具列表...");
    const tools = await client.listTools();
    console.log("可用工具:");
    tools.tools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });
  } catch (error) {
    console.error("獲取工具列表時發生錯誤:", error);
  }
}

// 列出所有應用程式
async function listApplications(client: Client): Promise<void> {
  try {
    console.log("正在獲取應用程式列表...");
    const result = await client.callTool({
      name: "list_applications",
      arguments: {},
    });

    console.log("已安裝的應用程式:");
    console.log(result);
  } catch (error) {
    console.error("獲取應用程式列表時發生錯誤:", error);
  }
}

// 啟動應用程式
async function launchApp(client: Client, appName: string): Promise<void> {
  try {
    console.log(`正在啟動應用程式: ${appName}...`);
    const result = await client.callTool({
      name: "launch_app",
      arguments: {
        appName: appName,
      },
    });
    console.log(`結果`, result);
  } catch (error) {
    console.error("啟動應用程式時發生錯誤:", error);
  }
}

// 用應用程式開啟檔案
async function openWithApp(
  client: Client,
  appName: string,
  filePath: string
): Promise<void> {
  try {
    console.log(`正在用 ${appName} 開啟檔案: ${filePath}...`);
    const result = await client.callTool({
      name: "open_with_app",
      arguments: {
        appName: appName,
        filePath: filePath,
      },
    });
    console.log(`結果`, result);
  } catch (error) {
    console.error("用應用程式開啟檔案時發生錯誤:", error);
  }
}

// 顯示選單
function showMenu(): void {
  console.log("\nMac Apps Launcher MCP 伺服器測試客戶端");
  console.log("請選擇要測試的功能:");
  console.log("1. 列出可用的工具");
  console.log("2. 列出所有應用程式");
  console.log("3. 啟動應用程式");
  console.log("4. 用應用程式開啟檔案");
  console.log("0. 退出");
}

// 主函數
async function main(): Promise<void> {
  try {
    const client = await initClient();
    showMenu();

    userInput.on("line", async (input: string) => {
      switch (input.trim()) {
        case "1":
          await listTools(client);
          showMenu();
          break;
        case "2":
          await listApplications(client);
          showMenu();
          break;
        case "3":
          userInput.question(
            "請輸入要啟動的應用程式名稱: ",
            async (appName: string) => {
              await launchApp(client, appName);
              showMenu();
            }
          );
          break;
        case "4":
          userInput.question("請輸入應用程式名稱: ", (appName: string) => {
            userInput.question(
              "請輸入要開啟的檔案路徑: ",
              async (filePath: string) => {
                await openWithApp(client, appName, filePath);
                showMenu();
              }
            );
          });
          break;
        case "0":
          console.log("關閉測試客戶端...");
          userInput.close();
          process.exit(0);
          break;
        default:
          console.log("無效的選擇，請重試");
          showMenu();
      }
    });
  } catch (error) {
    console.error("執行測試客戶端時發生錯誤:", error);
    process.exit(1);
  }
}

// 處理程序終止
process.on("SIGINT", () => {
  console.log("關閉測試客戶端...");
  process.exit(0);
});

// 啟動主函數
main();
