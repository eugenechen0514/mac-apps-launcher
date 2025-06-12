import { readdir } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function listApplications(): Promise<string[]> {
  try {
    const files = await readdir("/Applications");
    return files.filter((file) => file.endsWith(".app")).sort();
  } catch (error) {
    console.error("Error listing applications:", error);
    return [];
  }
}

export async function launchApp(appName: string): Promise<boolean> {
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

export async function openWithApp(
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
