import { v1 } from "@docker/extension-api-client-types";
import { ExecResult } from "@docker/extension-api-client-types/dist/v0";
import { encode } from "js-base64";

export const readFileInPromptsVolume = async (
  client: v1.DockerDesktopClient,
  path: string
) => {
  try {
    const result = await client.extension.host?.cli.exec("host-binary", ["read-from-volume", path]);
    if (result) {
      return result.stdout;
    }
  } catch { }

  return ""
};

export const writeToPromptsVolume = async (
  client: v1.DockerDesktopClient,
  filename: string,
  content: string
) => {
  try {
    await client.extension.host?.cli.exec("host-binary", ["write-to-volume", filename, encode(content)]);
  } catch (e) {
    if (e instanceof Error) {
      client.desktopUI.toast.error(e.message);
    }
    if ((e as ExecResult).stderr) {
      client.desktopUI.toast.error(JSON.stringify(e));
    }
  }
};
